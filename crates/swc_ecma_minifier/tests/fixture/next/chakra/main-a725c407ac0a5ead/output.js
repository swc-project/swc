(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [179],
    {
        5300: function (__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function (arr, len) {
                    (null == len || len > arr.length) && (len = arr.length);
                    for (var i = 0, arr2 = Array(len); i < len; i++)
                        arr2[i] = arr[i];
                    return arr2;
                });
        },
        6564: function (__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function (arr) {
                    if (Array.isArray(arr)) return arr;
                });
        },
        2568: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var obj;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function (arr) {
                    if (Array.isArray(arr))
                        return _arrayLikeToArrayMjs.default(arr);
                });
            var _arrayLikeToArrayMjs =
                (obj = __webpack_require__(5300)) && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
        },
        8646: function (__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function (self1) {
                    if (void 0 === self1)
                        throw ReferenceError(
                            "this hasn't been initialised - super() hasn't been called"
                        );
                    return self1;
                });
        },
        932: function (__unused_webpack_module, exports) {
            "use strict";
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
                    var info = gen[key](arg),
                        value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                info.done
                    ? resolve(value)
                    : Promise.resolve(value).then(_next, _throw);
            }
            exports.Z = function (fn) {
                return function () {
                    var self1 = this,
                        args = arguments;
                    return new Promise(function (resolve, reject) {
                        var gen = fn.apply(self1, args);
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
                        _next(void 0);
                    });
                };
            };
        },
        9658: function (__unused_webpack_module, exports) {
            "use strict";
            exports.Z = function (instance, Constructor) {
                if (!(instance instanceof Constructor))
                    throw TypeError("Cannot call a class as a function");
            };
        },
        5317: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var obj;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function (Parent, args, Class) {
                    return construct.apply(null, arguments);
                });
            var _setPrototypeOfMjs =
                (obj = __webpack_require__(5814)) && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            function construct(Parent1, args1, Class1) {
                return (construct = !(function () {
                    if (
                        "undefined" == typeof Reflect ||
                        !Reflect.construct ||
                        Reflect.construct.sham
                    )
                        return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return (
                            Date.prototype.toString.call(
                                Reflect.construct(Date, [], function () {})
                            ),
                            !0
                        );
                    } catch (e) {
                        return !1;
                    }
                })()
                    ? function (Parent, args, Class) {
                          var a = [null];
                          a.push.apply(a, args);
                          var Constructor = Function.bind.apply(Parent, a),
                              instance = new Constructor();
                          return (
                              Class &&
                                  _setPrototypeOfMjs.default(
                                      instance,
                                      Class.prototype
                                  ),
                              instance
                          );
                      }
                    : Reflect.construct).apply(null, arguments);
            }
        },
        7222: function (__unused_webpack_module, exports) {
            "use strict";
            function _defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    (descriptor.enumerable = descriptor.enumerable || !1),
                        (descriptor.configurable = !0),
                        "value" in descriptor && (descriptor.writable = !0),
                        Object.defineProperty(
                            target,
                            descriptor.key,
                            descriptor
                        );
                }
            }
            exports.Z = function (Constructor, protoProps, staticProps) {
                return (
                    protoProps &&
                        _defineProperties(Constructor.prototype, protoProps),
                    staticProps && _defineProperties(Constructor, staticProps),
                    Constructor
                );
            };
        },
        7735: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            exports.Z = function (Derived) {
                var hasNativeReflectConstruct =
                    _isNativeReflectConstructMjs.default();
                return function () {
                    var Super = _getPrototypeOfMjs.default(Derived),
                        result;
                    if (hasNativeReflectConstruct) {
                        var NewTarget =
                            _getPrototypeOfMjs.default(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else result = Super.apply(this, arguments);
                    return _possibleConstructorReturnMjs.default(this, result);
                };
            };
            var _isNativeReflectConstructMjs = _interopRequireDefault(
                    __webpack_require__(9158)
                ),
                _getPrototypeOfMjs = _interopRequireDefault(
                    __webpack_require__(898)
                ),
                _possibleConstructorReturnMjs = _interopRequireDefault(
                    __webpack_require__(9241)
                );
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
        },
        9361: function (__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function (obj, key, value) {
                    return (
                        key in obj
                            ? Object.defineProperty(obj, key, {
                                  value: value,
                                  enumerable: !0,
                                  configurable: !0,
                                  writable: !0,
                              })
                            : (obj[key] = value),
                        obj
                    );
                });
        },
        898: function (__unused_webpack_module, exports) {
            "use strict";
            function getPrototypeOf(o1) {
                return (getPrototypeOf = Object.setPrototypeOf
                    ? Object.getPrototypeOf
                    : function (o) {
                          return o.__proto__ || Object.getPrototypeOf(o);
                      })(o1);
            }
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function (o) {
                    return getPrototypeOf(o);
                });
        },
        7788: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var obj;
            exports.Z = function (subClass, superClass) {
                if ("function" != typeof superClass && null !== superClass)
                    throw TypeError(
                        "Super expression must either be null or a function"
                    );
                (subClass.prototype = Object.create(
                    superClass && superClass.prototype,
                    {
                        constructor: {
                            value: subClass,
                            writable: !0,
                            configurable: !0,
                        },
                    }
                )),
                    superClass &&
                        _setPrototypeOfMjs.default(subClass, superClass);
            };
            var _setPrototypeOfMjs =
                (obj = __webpack_require__(5814)) && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
        },
        6856: function (__unused_webpack_module, exports) {
            "use strict";
            exports.Z = function (left, right) {
                return null != right &&
                    "undefined" != typeof Symbol &&
                    right[Symbol.hasInstance]
                    ? !!right[Symbol.hasInstance](left)
                    : left instanceof right;
            };
        },
        2648: function (__unused_webpack_module, exports) {
            "use strict";
            exports.Z = function (obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            };
        },
        1598: function (__unused_webpack_module, exports) {
            "use strict";
            function _getRequireWildcardCache() {
                if ("function" != typeof WeakMap) return null;
                var cache = new WeakMap();
                return (
                    (_getRequireWildcardCache = function () {
                        return cache;
                    }),
                    cache
                );
            }
            exports.Z = function (obj) {
                if (obj && obj.__esModule) return obj;
                if (
                    null === obj ||
                    ("object" != typeof obj && "function" != typeof obj)
                )
                    return {
                        default: obj,
                    };
                var cache = _getRequireWildcardCache();
                if (cache && cache.has(obj)) return cache.get(obj);
                var newObj = {},
                    hasPropertyDescriptor =
                        Object.defineProperty &&
                        Object.getOwnPropertyDescriptor;
                for (var key in obj)
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        var desc = hasPropertyDescriptor
                            ? Object.getOwnPropertyDescriptor(obj, key)
                            : null;
                        desc && (desc.get || desc.set)
                            ? Object.defineProperty(newObj, key, desc)
                            : (newObj[key] = obj[key]);
                    }
                return (
                    (newObj.default = obj),
                    cache && cache.set(obj, newObj),
                    newObj
                );
            };
        },
        4499: function (__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function (fn) {
                    return (
                        -1 !==
                        Function.toString.call(fn).indexOf("[native code]")
                    );
                });
        },
        9158: function (__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function () {
                    if (
                        "undefined" == typeof Reflect ||
                        !Reflect.construct ||
                        Reflect.construct.sham
                    )
                        return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return (
                            Boolean.prototype.valueOf.call(
                                Reflect.construct(Boolean, [], function () {})
                            ),
                            !0
                        );
                    } catch (e) {
                        return !1;
                    }
                });
        },
        1301: function (__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function (iter) {
                    if (
                        ("undefined" != typeof Symbol &&
                            null != iter[Symbol.iterator]) ||
                        null != iter["@@iterator"]
                    )
                        return Array.from(iter);
                });
        },
        6936: function (__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function () {
                    throw TypeError(
                        "Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                    );
                });
        },
        4162: function (__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function () {
                    throw TypeError(
                        "Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                    );
                });
        },
        337: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var obj;
            exports.Z = function (target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = null != arguments[i] ? arguments[i] : {},
                        ownKeys = Object.keys(source);
                    "function" == typeof Object.getOwnPropertySymbols &&
                        (ownKeys = ownKeys.concat(
                            Object.getOwnPropertySymbols(source).filter(
                                function (sym) {
                                    return Object.getOwnPropertyDescriptor(
                                        source,
                                        sym
                                    ).enumerable;
                                }
                            )
                        )),
                        ownKeys.forEach(function (key) {
                            _definePropertyMjs.default(
                                target,
                                key,
                                source[key]
                            );
                        });
                }
                return target;
            };
            var _definePropertyMjs =
                (obj = __webpack_require__(9361)) && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
        },
        9961: function (__unused_webpack_module, exports) {
            "use strict";
            exports.Z = function (target, source) {
                return (
                    (source = null != source ? source : {}),
                    Object.getOwnPropertyDescriptors
                        ? Object.defineProperties(
                              target,
                              Object.getOwnPropertyDescriptors(source)
                          )
                        : (function (object, enumerableOnly) {
                              var keys = Object.keys(object);
                              if (Object.getOwnPropertySymbols) {
                                  var symbols =
                                      Object.getOwnPropertySymbols(object);
                                  keys.push.apply(keys, symbols);
                              }
                              return keys;
                          })(Object(source)).forEach(function (key) {
                              Object.defineProperty(
                                  target,
                                  key,
                                  Object.getOwnPropertyDescriptor(source, key)
                              );
                          }),
                    target
                );
            };
        },
        9241: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function (self1, call) {
                    return call &&
                        ("object" === _typeOfMjs.default(call) ||
                            "function" == typeof call)
                        ? call
                        : _assertThisInitializedMjs.default(self1);
                });
            var _assertThisInitializedMjs = _interopRequireDefault(
                    __webpack_require__(8646)
                ),
                _typeOfMjs = _interopRequireDefault(__webpack_require__(5753));
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
        },
        5814: function (__unused_webpack_module, exports) {
            "use strict";
            function setPrototypeOf(o1, p1) {
                return (setPrototypeOf =
                    Object.setPrototypeOf ||
                    function (o, p) {
                        return (o.__proto__ = p), o;
                    })(o1, p1);
            }
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function (o, p) {
                    return setPrototypeOf(o, p);
                });
        },
        4941: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            exports.Z = function (arr, i) {
                return (
                    _arrayWithHolesMjs.default(arr) ||
                    _iterableToArrayMjs.default(arr, i) ||
                    _unsupportedIterableToArrayMjs.default(arr, i) ||
                    _nonIterableRestMjs.default()
                );
            };
            var _arrayWithHolesMjs = _interopRequireDefault(
                    __webpack_require__(6564)
                ),
                _iterableToArrayMjs = _interopRequireDefault(
                    __webpack_require__(1301)
                ),
                _nonIterableRestMjs = _interopRequireDefault(
                    __webpack_require__(6936)
                ),
                _unsupportedIterableToArrayMjs = _interopRequireDefault(
                    __webpack_require__(2149)
                );
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
        },
        3929: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            exports.Z = function (arr) {
                return (
                    _arrayWithoutHolesMjs.default(arr) ||
                    _iterableToArrayMjs.default(arr) ||
                    _unsupportedIterableToArrayMjs.default(arr) ||
                    _nonIterableSpreadMjs.default()
                );
            };
            var _arrayWithoutHolesMjs = _interopRequireDefault(
                    __webpack_require__(2568)
                ),
                _iterableToArrayMjs = _interopRequireDefault(
                    __webpack_require__(1301)
                ),
                _nonIterableSpreadMjs = _interopRequireDefault(
                    __webpack_require__(4162)
                ),
                _unsupportedIterableToArrayMjs = _interopRequireDefault(
                    __webpack_require__(2149)
                );
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
        },
        5753: function (__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function (obj) {
                    return obj && obj.constructor === Symbol
                        ? "symbol"
                        : typeof obj;
                });
        },
        2149: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var obj;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function (o, minLen) {
                    if (o) {
                        if ("string" == typeof o)
                            return _arrayLikeToArrayMjs.default(o, minLen);
                        var n = Object.prototype.toString.call(o).slice(8, -1);
                        if (
                            ("Object" === n &&
                                o.constructor &&
                                (n = o.constructor.name),
                            "Map" === n || "Set" === n)
                        )
                            return Array.from(n);
                        if (
                            "Arguments" === n ||
                            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                        )
                            return _arrayLikeToArrayMjs.default(o, minLen);
                    }
                });
            var _arrayLikeToArrayMjs =
                (obj = __webpack_require__(5300)) && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
        },
        9968: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            exports.Z = function (Class) {
                return wrapNativeSuper(Class);
            };
            var _constructMjs = _interopRequireDefault(
                    __webpack_require__(5317)
                ),
                _isNativeFunctionMjs = _interopRequireDefault(
                    __webpack_require__(4499)
                ),
                _getPrototypeOfMjs = _interopRequireDefault(
                    __webpack_require__(898)
                ),
                _setPrototypeOfMjs = _interopRequireDefault(
                    __webpack_require__(5814)
                );
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            function wrapNativeSuper(Class1) {
                var _cache = "function" == typeof Map ? new Map() : void 0;
                return (wrapNativeSuper = function (Class) {
                    if (null === Class || !_isNativeFunctionMjs.default(Class))
                        return Class;
                    if ("function" != typeof Class)
                        throw TypeError(
                            "Super expression must either be null or a function"
                        );
                    if (void 0 !== _cache) {
                        if (_cache.has(Class)) return _cache.get(Class);
                        _cache.set(Class, Wrapper);
                    }
                    function Wrapper() {
                        return _constructMjs.default(
                            Class,
                            arguments,
                            _getPrototypeOfMjs.default(this).constructor
                        );
                    }
                    return (
                        (Wrapper.prototype = Object.create(Class.prototype, {
                            constructor: {
                                value: Wrapper,
                                enumerable: !1,
                                writable: !0,
                                configurable: !0,
                            },
                        })),
                        _setPrototypeOfMjs.default(Wrapper, Class)
                    );
                })(Class1);
            }
        },
        37: function () {
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
        },
        8684: function (module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.addBasePath = function (path, required) {
                    return _normalizeTrailingSlash.normalizePathTrailingSlash(
                        _addPathPrefix.addPathPrefix(path, "")
                    );
                });
            var _addPathPrefix = __webpack_require__(5391),
                _normalizeTrailingSlash = __webpack_require__(2392);
            ("function" == typeof exports.default ||
                ("object" == typeof exports.default &&
                    null !== exports.default)) &&
                void 0 === exports.default.__esModule &&
                (Object.defineProperty(exports.default, "__esModule", {
                    value: !0,
                }),
                Object.assign(exports.default, exports),
                (module.exports = exports.default));
        },
        2725: function (module, exports, __webpack_require__) {
            "use strict";
            __webpack_require__(3929).Z,
                Object.defineProperty(exports, "__esModule", {
                    value: !0,
                }),
                (exports.addLocale = void 0),
                __webpack_require__(2392),
                (exports.addLocale = function (path) {
                    for (
                        var _len = arguments.length,
                            args = Array(_len > 1 ? _len - 1 : 0),
                            _key = 1;
                        _key < _len;
                        _key++
                    )
                        args[_key - 1] = arguments[_key];
                    return path;
                }),
                ("function" == typeof exports.default ||
                    ("object" == typeof exports.default &&
                        null !== exports.default)) &&
                    void 0 === exports.default.__esModule &&
                    (Object.defineProperty(exports.default, "__esModule", {
                        value: !0,
                    }),
                    Object.assign(exports.default, exports),
                    (module.exports = exports.default));
        },
        8748: function (module, exports, __webpack_require__) {
            "use strict";
            __webpack_require__(3929).Z,
                Object.defineProperty(exports, "__esModule", {
                    value: !0,
                }),
                (exports.detectDomainLocale = void 0),
                (exports.detectDomainLocale = function () {
                    for (
                        var _len = arguments.length,
                            args = Array(_len),
                            _key = 0;
                        _key < _len;
                        _key++
                    )
                        args[_key] = arguments[_key];
                }),
                ("function" == typeof exports.default ||
                    ("object" == typeof exports.default &&
                        null !== exports.default)) &&
                    void 0 === exports.default.__esModule &&
                    (Object.defineProperty(exports.default, "__esModule", {
                        value: !0,
                    }),
                    Object.assign(exports.default, exports),
                    (module.exports = exports.default));
        },
        4119: function (module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.hasBasePath = function (path) {
                    return _pathHasPrefix.pathHasPrefix(path, "");
                });
            var _pathHasPrefix = __webpack_require__(1259);
            ("function" == typeof exports.default ||
                ("object" == typeof exports.default &&
                    null !== exports.default)) &&
                void 0 === exports.default.__esModule &&
                (Object.defineProperty(exports.default, "__esModule", {
                    value: !0,
                }),
                Object.assign(exports.default, exports),
                (module.exports = exports.default));
        },
        6007: function (module, exports, __webpack_require__) {
            "use strict";
            var _instanceof = __webpack_require__(6856).Z;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function () {
                    return {
                        mountedInstances: new Set(),
                        updateHead: function (head) {
                            var tags = {};
                            head.forEach(function (h) {
                                if (
                                    "link" === h.type &&
                                    h.props["data-optimized-fonts"]
                                ) {
                                    if (
                                        document.querySelector(
                                            'style[data-href="'.concat(
                                                h.props["data-href"],
                                                '"]'
                                            )
                                        )
                                    )
                                        return;
                                    (h.props.href = h.props["data-href"]),
                                        (h.props["data-href"] = void 0);
                                }
                                var components = tags[h.type] || [];
                                components.push(h), (tags[h.type] = components);
                            });
                            var titleComponent = tags.title
                                    ? tags.title[0]
                                    : null,
                                title = "";
                            if (titleComponent) {
                                var children = titleComponent.props.children;
                                title =
                                    "string" == typeof children
                                        ? children
                                        : Array.isArray(children)
                                        ? children.join("")
                                        : "";
                            }
                            title !== document.title &&
                                (document.title = title),
                                [
                                    "meta",
                                    "base",
                                    "link",
                                    "style",
                                    "script",
                                ].forEach(function (type) {
                                    updateElements(type, tags[type] || []);
                                });
                        },
                    };
                }),
                (exports.isEqualNode = isEqualNode),
                (exports.DOMAttributeNames = void 0);
            var DOMAttributeNames = {
                acceptCharset: "accept-charset",
                className: "class",
                htmlFor: "for",
                httpEquiv: "http-equiv",
                noModule: "noModule",
            };
            function reactElementToDOM(param) {
                var type = param.type,
                    props = param.props,
                    el = document.createElement(type);
                for (var p in props)
                    if (
                        props.hasOwnProperty(p) &&
                        "children" !== p &&
                        "dangerouslySetInnerHTML" !== p &&
                        void 0 !== props[p]
                    ) {
                        var attr = DOMAttributeNames[p] || p.toLowerCase();
                        "script" === type &&
                        ("async" === attr ||
                            "defer" === attr ||
                            "noModule" === attr)
                            ? (el[attr] = !!props[p])
                            : el.setAttribute(attr, props[p]);
                    }
                var children = props.children,
                    dangerouslySetInnerHTML = props.dangerouslySetInnerHTML;
                return (
                    dangerouslySetInnerHTML
                        ? (el.innerHTML = dangerouslySetInnerHTML.__html || "")
                        : children &&
                          (el.textContent =
                              "string" == typeof children
                                  ? children
                                  : Array.isArray(children)
                                  ? children.join("")
                                  : ""),
                    el
                );
            }
            function isEqualNode(oldTag, newTag) {
                if (
                    _instanceof(oldTag, HTMLElement) &&
                    _instanceof(newTag, HTMLElement)
                ) {
                    var nonce = newTag.getAttribute("nonce");
                    if (nonce && !oldTag.getAttribute("nonce")) {
                        var cloneTag = newTag.cloneNode(!0);
                        return (
                            cloneTag.setAttribute("nonce", ""),
                            (cloneTag.nonce = nonce),
                            nonce === oldTag.nonce &&
                                oldTag.isEqualNode(cloneTag)
                        );
                    }
                }
                return oldTag.isEqualNode(newTag);
            }
            function updateElements(type, components) {
                for (
                    var headEl = document.getElementsByTagName("head")[0],
                        headCountEl = headEl.querySelector(
                            "meta[name=next-head-count]"
                        ),
                        headCount = Number(headCountEl.content),
                        oldTags = [],
                        i = 0,
                        j = headCountEl.previousElementSibling;
                    i < headCount;
                    i++,
                        j =
                            (null == j ? void 0 : j.previousElementSibling) ||
                            null
                ) {
                    var ref;
                    (null == j
                        ? void 0
                        : null == (ref = j.tagName)
                        ? void 0
                        : ref.toLowerCase()) === type && oldTags.push(j);
                }
                var newTags = components
                    .map(reactElementToDOM)
                    .filter(function (newTag) {
                        for (var k = 0, len = oldTags.length; k < len; k++) {
                            var oldTag = oldTags[k];
                            if (isEqualNode(oldTag, newTag))
                                return oldTags.splice(k, 1), !1;
                        }
                        return !0;
                    });
                oldTags.forEach(function (t) {
                    var ref;
                    return null == (ref = t.parentNode)
                        ? void 0
                        : ref.removeChild(t);
                }),
                    newTags.forEach(function (t) {
                        return headEl.insertBefore(t, headCountEl);
                    }),
                    (headCountEl.content = (
                        headCount -
                        oldTags.length +
                        newTags.length
                    ).toString());
            }
            (exports.DOMAttributeNames = DOMAttributeNames),
                ("function" == typeof exports.default ||
                    ("object" == typeof exports.default &&
                        null !== exports.default)) &&
                    void 0 === exports.default.__esModule &&
                    (Object.defineProperty(exports.default, "__esModule", {
                        value: !0,
                    }),
                    Object.assign(exports.default, exports),
                    (module.exports = exports.default));
        },
        7339: function (module, exports, __webpack_require__) {
            "use strict";
            var _class_call_check = __webpack_require__(9658).Z,
                _create_class = __webpack_require__(7222).Z,
                _inherits = __webpack_require__(7788).Z,
                _interop_require_default = __webpack_require__(2648).Z,
                _interop_require_wildcard = __webpack_require__(1598).Z,
                _sliced_to_array = __webpack_require__(4941).Z,
                _create_super = __webpack_require__(7735).Z,
                _runtimeJs = _interop_require_default(
                    __webpack_require__(4051)
                );
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.initialize = function () {
                    return _initialize.apply(this, arguments);
                }),
                (exports.hydrate = function (opts) {
                    return _hydrate.apply(this, arguments);
                }),
                (exports.emitter = exports.router = exports.version = void 0),
                __webpack_require__(37);
            var _react = (function (obj) {
                    if (obj && obj.__esModule) return obj;
                    if (
                        null === obj ||
                        ("object" != typeof obj && "function" != typeof obj)
                    )
                        return {
                            default: obj,
                        };
                    var cache = _getRequireWildcardCache();
                    if (cache && cache.has(obj)) return cache.get(obj);
                    var newObj = {},
                        hasPropertyDescriptor =
                            Object.defineProperty &&
                            Object.getOwnPropertyDescriptor;
                    for (var key in obj)
                        if (Object.prototype.hasOwnProperty.call(obj, key)) {
                            var desc = hasPropertyDescriptor
                                ? Object.getOwnPropertyDescriptor(obj, key)
                                : null;
                            desc && (desc.get || desc.set)
                                ? Object.defineProperty(newObj, key, desc)
                                : (newObj[key] = obj[key]);
                        }
                    return (
                        (newObj.default = obj),
                        cache && cache.set(obj, newObj),
                        newObj
                    );
                })(__webpack_require__(7294)),
                _headManagerContext = __webpack_require__(8404),
                _mitt = _interopRequireDefault(__webpack_require__(5660)),
                _routerContext = __webpack_require__(3462),
                _isDynamic = __webpack_require__(8689),
                _querystring = __webpack_require__(466),
                _runtimeConfig = __webpack_require__(8027),
                _utils = __webpack_require__(3794),
                _portal = __webpack_require__(2207),
                _headManager = _interopRequireDefault(
                    __webpack_require__(6007)
                ),
                _pageLoader = _interopRequireDefault(__webpack_require__(5181)),
                _performanceRelayer = _interopRequireDefault(
                    __webpack_require__(9302)
                ),
                _routeAnnouncer = __webpack_require__(8982),
                _router = __webpack_require__(387),
                _isError = __webpack_require__(676),
                _imageConfigContext = __webpack_require__(9977),
                _removeBasePath = __webpack_require__(9320),
                _hasBasePath = __webpack_require__(4119);
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
                    var info = gen[key](arg),
                        value = info.value;
                } catch (error) {
                    reject(error);
                    return;
                }
                info.done
                    ? resolve(value)
                    : Promise.resolve(value).then(_next, _throw);
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
                        _next(void 0);
                    });
                };
            }
            function _extends() {
                return (_extends =
                    Object.assign ||
                    function (target) {
                        for (var i = 1; i < arguments.length; i++) {
                            var source = arguments[i];
                            for (var key in source)
                                Object.prototype.hasOwnProperty.call(
                                    source,
                                    key
                                ) && (target[key] = source[key]);
                        }
                        return target;
                    }).apply(this, arguments);
            }
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            function _getRequireWildcardCache() {
                if ("function" != typeof WeakMap) return null;
                var cache = new WeakMap();
                return (
                    (_getRequireWildcardCache = function () {
                        return cache;
                    }),
                    cache
                );
            }
            var ReactDOM = __webpack_require__(745),
                router;
            (exports.version = "12.2.0"), (exports.router = router);
            var emitter = _mitt.default();
            exports.emitter = emitter;
            var looseToArray = function (input) {
                    return [].slice.call(input);
                },
                initialData,
                defaultLocale = void 0,
                asPath,
                pageLoader,
                appElement,
                headManager,
                initialMatchesMiddleware = !1,
                lastRenderReject,
                CachedApp,
                onPerfEntry,
                CachedComponent;
            self.__next_require__ = __webpack_require__;
            var Container = (function (_Component) {
                _inherits(Container, _Component);
                var _super = _create_super(Container);
                function Container() {
                    return (
                        _class_call_check(this, Container),
                        _super.apply(this, arguments)
                    );
                }
                return (
                    _create_class(Container, [
                        {
                            key: "componentDidCatch",
                            value: function (componentErr, info) {
                                this.props.fn(componentErr, info);
                            },
                        },
                        {
                            key: "componentDidMount",
                            value: function () {
                                this.scrollToHash(),
                                    router.isSsr &&
                                        "/404" !== initialData.page &&
                                        "/_error" !== initialData.page &&
                                        (initialData.isFallback ||
                                            (initialData.nextExport &&
                                                (_isDynamic.isDynamicRoute(
                                                    router.pathname
                                                ) ||
                                                    location.search ||
                                                    initialMatchesMiddleware)) ||
                                            (initialData.props &&
                                                initialData.props.__N_SSG &&
                                                (location.search ||
                                                    initialMatchesMiddleware))) &&
                                        router
                                            .replace(
                                                router.pathname +
                                                    "?" +
                                                    String(
                                                        _querystring.assign(
                                                            _querystring.urlQueryToSearchParams(
                                                                router.query
                                                            ),
                                                            new URLSearchParams(
                                                                location.search
                                                            )
                                                        )
                                                    ),
                                                asPath,
                                                {
                                                    _h: 1,
                                                    shallow:
                                                        !initialData.isFallback &&
                                                        !initialMatchesMiddleware,
                                                }
                                            )
                                            .catch(function (err) {
                                                if (!err.cancelled) throw err;
                                            });
                            },
                        },
                        {
                            key: "componentDidUpdate",
                            value: function () {
                                this.scrollToHash();
                            },
                        },
                        {
                            key: "scrollToHash",
                            value: function () {
                                var hash = location.hash;
                                if ((hash = hash && hash.substring(1))) {
                                    var el = document.getElementById(hash);
                                    el &&
                                        setTimeout(function () {
                                            return el.scrollIntoView();
                                        }, 0);
                                }
                            },
                        },
                        {
                            key: "render",
                            value: function () {
                                return this.props.children;
                            },
                        },
                    ]),
                    Container
                );
            })(_react.default.Component);
            function _initialize() {
                return (_initialize = _asyncToGenerator(
                    _runtimeJs.default.mark(function _callee() {
                        var opts,
                            prefix,
                            initScriptLoader,
                            register,
                            _args = arguments;
                        return _runtimeJs.default.wrap(function (_ctx) {
                            for (;;)
                                switch ((_ctx.prev = _ctx.next)) {
                                    case 0:
                                        return (
                                            (opts =
                                                _args.length > 0 &&
                                                void 0 !== _args[0]
                                                    ? _args[0]
                                                    : {}),
                                            (initialData = JSON.parse(
                                                document.getElementById(
                                                    "__NEXT_DATA__"
                                                ).textContent
                                            )),
                                            (window.__NEXT_DATA__ =
                                                initialData),
                                            (defaultLocale =
                                                initialData.defaultLocale),
                                            (prefix =
                                                initialData.assetPrefix || ""),
                                            (__webpack_require__.p = "".concat(
                                                prefix,
                                                "/_next/"
                                            )),
                                            _runtimeConfig.setConfig({
                                                serverRuntimeConfig: {},
                                                publicRuntimeConfig:
                                                    initialData.runtimeConfig ||
                                                    {},
                                            }),
                                            (asPath = _utils.getURL()),
                                            _hasBasePath.hasBasePath(asPath) &&
                                                (asPath =
                                                    _removeBasePath.removeBasePath(
                                                        asPath
                                                    )),
                                            initialData.scriptLoader &&
                                                (initScriptLoader =
                                                    __webpack_require__(
                                                        699
                                                    ).initScriptLoader)(
                                                    initialData.scriptLoader
                                                ),
                                            (pageLoader =
                                                new _pageLoader.default(
                                                    initialData.buildId,
                                                    prefix
                                                )),
                                            (register = function (param) {
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
                                            }),
                                            window.__NEXT_P &&
                                                window.__NEXT_P.map(function (
                                                    p
                                                ) {
                                                    return setTimeout(
                                                        function () {
                                                            return register(p);
                                                        },
                                                        0
                                                    );
                                                }),
                                            (window.__NEXT_P = []),
                                            (window.__NEXT_P.push = register),
                                            ((headManager =
                                                _headManager.default()).getIsSsr =
                                                function () {
                                                    return router.isSsr;
                                                }),
                                            (appElement =
                                                document.getElementById(
                                                    "__next"
                                                )),
                                            _ctx.abrupt("return", {
                                                assetPrefix: prefix,
                                            })
                                        );
                                    case 21:
                                    case "end":
                                        return _ctx.stop();
                                }
                        }, _callee);
                    })
                )).apply(this, arguments);
            }
            function _hydrate() {
                return (_hydrate = _asyncToGenerator(
                    _runtimeJs.default.mark(function _callee(opts) {
                        var initialErr,
                            appEntrypoint,
                            app,
                            mod,
                            pageEntrypoint,
                            renderCtx;
                        return _runtimeJs.default.wrap(
                            function (_ctx) {
                                for (;;)
                                    switch ((_ctx.prev = _ctx.next)) {
                                        case 0:
                                            return (
                                                (initialErr = initialData.err),
                                                (_ctx.prev = 1),
                                                (_ctx.next = 4),
                                                pageLoader.routeLoader.whenEntrypoint(
                                                    "/_app"
                                                )
                                            );
                                        case 4:
                                            if (
                                                !(
                                                    "error" in
                                                    (appEntrypoint = _ctx.sent)
                                                )
                                            ) {
                                                _ctx.next = 7;
                                                break;
                                            }
                                            throw appEntrypoint.error;
                                        case 7:
                                            (app = appEntrypoint.component),
                                                (mod = appEntrypoint.exports),
                                                (CachedApp = app),
                                                mod &&
                                                    mod.reportWebVitals &&
                                                    (onPerfEntry = function (
                                                        param
                                                    ) {
                                                        var id = param.id,
                                                            name = param.name,
                                                            startTime =
                                                                param.startTime,
                                                            value = param.value,
                                                            duration =
                                                                param.duration,
                                                            entryType =
                                                                param.entryType,
                                                            entries =
                                                                param.entries,
                                                            uniqueID = ""
                                                                .concat(
                                                                    Date.now(),
                                                                    "-"
                                                                )
                                                                .concat(
                                                                    Math.floor(
                                                                        Math.random() *
                                                                            (9e12 -
                                                                                1)
                                                                    ) + 1e12
                                                                ),
                                                            perfStartEntry;
                                                        entries &&
                                                            entries.length &&
                                                            (perfStartEntry =
                                                                entries[0]
                                                                    .startTime);
                                                        var webVitals = {
                                                            id: id || uniqueID,
                                                            name: name,
                                                            startTime:
                                                                startTime ||
                                                                perfStartEntry,
                                                            value:
                                                                null == value
                                                                    ? duration
                                                                    : value,
                                                            label:
                                                                "mark" ===
                                                                    entryType ||
                                                                "measure" ===
                                                                    entryType
                                                                    ? "custom"
                                                                    : "web-vital",
                                                        };
                                                        mod.reportWebVitals(
                                                            webVitals
                                                        );
                                                    }),
                                                (_ctx.next = 14);
                                            break;
                                        case 14:
                                            return (
                                                (_ctx.next = 16),
                                                pageLoader.routeLoader.whenEntrypoint(
                                                    initialData.page
                                                )
                                            );
                                        case 16:
                                            _ctx.t0 = _ctx.sent;
                                        case 17:
                                            if (
                                                !(
                                                    "error" in
                                                    (pageEntrypoint = _ctx.t0)
                                                )
                                            ) {
                                                _ctx.next = 20;
                                                break;
                                            }
                                            throw pageEntrypoint.error;
                                        case 20:
                                            (CachedComponent =
                                                pageEntrypoint.component),
                                                (_ctx.next = 25);
                                            break;
                                        case 25:
                                            _ctx.next = 30;
                                            break;
                                        case 27:
                                            (_ctx.prev = 27),
                                                (_ctx.t1 = _ctx.catch(1)),
                                                (initialErr =
                                                    _isError.getProperError(
                                                        _ctx.t1
                                                    ));
                                        case 30:
                                            if (!window.__NEXT_PRELOADREADY) {
                                                _ctx.next = 34;
                                                break;
                                            }
                                            return (
                                                (_ctx.next = 34),
                                                window.__NEXT_PRELOADREADY(
                                                    initialData.dynamicIds
                                                )
                                            );
                                        case 34:
                                            return (
                                                (exports.router = router =
                                                    _router.createRouter(
                                                        initialData.page,
                                                        initialData.query,
                                                        asPath,
                                                        {
                                                            initialProps:
                                                                initialData.props,
                                                            pageLoader:
                                                                pageLoader,
                                                            App: CachedApp,
                                                            Component:
                                                                CachedComponent,
                                                            wrapApp: wrapApp,
                                                            err: initialErr,
                                                            isFallback: Boolean(
                                                                initialData.isFallback
                                                            ),
                                                            subscription:
                                                                function (
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
                                                    )),
                                                (_ctx.next = 37),
                                                router._initialMatchesMiddlewarePromise
                                            );
                                        case 37:
                                            if (
                                                ((initialMatchesMiddleware =
                                                    _ctx.sent),
                                                (renderCtx = {
                                                    App: CachedApp,
                                                    initial: !0,
                                                    Component: CachedComponent,
                                                    props: initialData.props,
                                                    err: initialErr,
                                                }),
                                                !(null == opts
                                                    ? void 0
                                                    : opts.beforeRender))
                                            ) {
                                                _ctx.next = 42;
                                                break;
                                            }
                                            return (
                                                (_ctx.next = 42),
                                                opts.beforeRender()
                                            );
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
                )).apply(this, arguments);
            }
            function render(renderingProps) {
                return _render.apply(this, arguments);
            }
            function _render() {
                return (_render = _asyncToGenerator(
                    _runtimeJs.default.mark(function _callee(renderingProps) {
                        var renderErr;
                        return _runtimeJs.default.wrap(
                            function (_ctx) {
                                for (;;)
                                    switch ((_ctx.prev = _ctx.next)) {
                                        case 0:
                                            if (!renderingProps.err) {
                                                _ctx.next = 4;
                                                break;
                                            }
                                            return (
                                                (_ctx.next = 3),
                                                renderError(renderingProps)
                                            );
                                        case 3:
                                            return _ctx.abrupt("return");
                                        case 4:
                                            return (
                                                (_ctx.prev = 4),
                                                (_ctx.next = 7),
                                                doRender(renderingProps)
                                            );
                                        case 7:
                                            _ctx.next = 17;
                                            break;
                                        case 9:
                                            if (
                                                ((_ctx.prev = 9),
                                                (_ctx.t0 = _ctx.catch(4)),
                                                !(renderErr =
                                                    _isError.getProperError(
                                                        _ctx.t0
                                                    )).cancelled)
                                            ) {
                                                _ctx.next = 14;
                                                break;
                                            }
                                            throw renderErr;
                                        case 14:
                                            return (
                                                (_ctx.next = 17),
                                                renderError(
                                                    _extends(
                                                        {},
                                                        renderingProps,
                                                        {
                                                            err: renderErr,
                                                        }
                                                    )
                                                )
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
                )).apply(this, arguments);
            }
            function renderError(renderErrorProps) {
                var App = renderErrorProps.App,
                    err = renderErrorProps.err;
                return (
                    console.error(err),
                    console.error(
                        "A client-side exception has occurred, see here for more info: https://nextjs.org/docs/messages/client-side-exception-occurred"
                    ),
                    pageLoader
                        .loadPage("/_error")
                        .then(function (param) {
                            var ErrorComponent = param.page,
                                styleSheets = param.styleSheets;
                            return (null == lastAppProps
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
                                styleSheets = param.styleSheets,
                                AppTree = wrapApp(App),
                                appCtx = {
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
                                    : _utils.loadGetInitialProps(App, appCtx)
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
                        })
                );
            }
            var reactRoot = null,
                shouldHydrate = !0;
            function markHydrateComplete() {
                _utils.ST &&
                    (performance.mark("afterHydrate"),
                    performance.measure(
                        "Next.js-before-hydration",
                        "navigationStart",
                        "beforeRender"
                    ),
                    performance.measure(
                        "Next.js-hydration",
                        "beforeRender",
                        "afterHydrate"
                    ),
                    onPerfEntry &&
                        performance
                            .getEntriesByName("Next.js-hydration")
                            .forEach(onPerfEntry),
                    clearMarks());
            }
            function markRenderComplete() {
                if (_utils.ST) {
                    performance.mark("afterRender");
                    var navStartEntries = performance.getEntriesByName(
                        "routeChange",
                        "mark"
                    );
                    navStartEntries.length &&
                        (performance.measure(
                            "Next.js-route-change-to-render",
                            navStartEntries[0].name,
                            "beforeRender"
                        ),
                        performance.measure(
                            "Next.js-render",
                            "beforeRender",
                            "afterRender"
                        ),
                        onPerfEntry &&
                            (performance
                                .getEntriesByName("Next.js-render")
                                .forEach(onPerfEntry),
                            performance
                                .getEntriesByName(
                                    "Next.js-route-change-to-render"
                                )
                                .forEach(onPerfEntry)),
                        clearMarks(),
                        [
                            "Next.js-route-change-to-render",
                            "Next.js-render",
                        ].forEach(function (measure) {
                            return performance.clearMeasures(measure);
                        }));
                }
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
                return _react.default.createElement(
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
                    _react.default.createElement(
                        _routerContext.RouterContext.Provider,
                        {
                            value: _router.makePublicRouterInstance(router),
                        },
                        _react.default.createElement(
                            _headManagerContext.HeadManagerContext.Provider,
                            {
                                value: headManager,
                            },
                            _react.default.createElement(
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
                                        experimentalLayoutRaw: !1,
                                    },
                                },
                                children
                            )
                        )
                    )
                );
            }
            function renderApp(App, appProps) {
                return _react.default.createElement(
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
                        return _react.default.createElement(
                            AppContainer,
                            null,
                            renderApp(App, appProps)
                        );
                    };
                },
                RSCComponent,
                lastAppProps;
            function doRender(input) {
                var onStart = function () {
                        if (!styleSheets) return !1;
                        var currentStyleTags = looseToArray(
                                document.querySelectorAll("style[data-n-href]")
                            ),
                            currentHrefs = new Set(
                                currentStyleTags.map(function (tag) {
                                    return tag.getAttribute("data-n-href");
                                })
                            ),
                            noscript = document.querySelector(
                                "noscript[data-n-css]"
                            ),
                            nonce =
                                null == noscript
                                    ? void 0
                                    : noscript.getAttribute("data-n-css");
                        return (
                            styleSheets.forEach(function (param) {
                                var href = param.href,
                                    text = param.text;
                                if (!currentHrefs.has(href)) {
                                    var styleTag =
                                        document.createElement("style");
                                    styleTag.setAttribute("data-n-href", href),
                                        styleTag.setAttribute("media", "x"),
                                        nonce &&
                                            styleTag.setAttribute(
                                                "nonce",
                                                nonce
                                            ),
                                        document.head.appendChild(styleTag),
                                        styleTag.appendChild(
                                            document.createTextNode(text)
                                        );
                                }
                            }),
                            !0
                        );
                    },
                    onHeadCommit = function () {
                        if (styleSheets && !canceled) {
                            for (
                                var desiredHrefs = new Set(
                                        styleSheets.map(function (s) {
                                            return s.href;
                                        })
                                    ),
                                    currentStyleTags = looseToArray(
                                        document.querySelectorAll(
                                            "style[data-n-href]"
                                        )
                                    ),
                                    currentHrefs = currentStyleTags.map(
                                        function (tag) {
                                            return tag.getAttribute(
                                                "data-n-href"
                                            );
                                        }
                                    ),
                                    idx = 0;
                                idx < currentHrefs.length;
                                ++idx
                            )
                                desiredHrefs.has(currentHrefs[idx])
                                    ? currentStyleTags[idx].removeAttribute(
                                          "media"
                                      )
                                    : currentStyleTags[idx].setAttribute(
                                          "media",
                                          "x"
                                      );
                            var referenceNode = document.querySelector(
                                "noscript[data-n-css]"
                            );
                            referenceNode &&
                                styleSheets.forEach(function (param) {
                                    var href = param.href,
                                        targetTag = document.querySelector(
                                            'style[data-n-href="'.concat(
                                                href,
                                                '"]'
                                            )
                                        );
                                    targetTag &&
                                        (referenceNode.parentNode.insertBefore(
                                            targetTag,
                                            referenceNode.nextSibling
                                        ),
                                        (referenceNode = targetTag));
                                }),
                                looseToArray(
                                    document.querySelectorAll("link[data-n-p]")
                                ).forEach(function (el) {
                                    el.parentNode.removeChild(el);
                                });
                        }
                        input.scroll &&
                            window.scrollTo(input.scroll.x, input.scroll.y);
                    },
                    onRootCommit = function () {
                        resolvePromise();
                    },
                    App = input.App,
                    Component = input.Component,
                    props = input.props,
                    err = input.err,
                    __N_RSC = input.__N_RSC,
                    styleSheets =
                        "initial" in input ? void 0 : input.styleSheets;
                (Component = Component || lastAppProps.Component),
                    (props = props || lastAppProps.props);
                var appProps = _extends({}, props, {
                    Component: __N_RSC ? RSCComponent : Component,
                    err: err,
                    router: router,
                });
                lastAppProps = appProps;
                var canceled = !1,
                    resolvePromise,
                    renderPromise = new Promise(function (resolve, reject) {
                        lastRenderReject && lastRenderReject(),
                            (resolvePromise = function () {
                                (lastRenderReject = null), resolve();
                            }),
                            (lastRenderReject = function () {
                                (canceled = !0), (lastRenderReject = null);
                                var error = Error("Cancel rendering route");
                                (error.cancelled = !0), reject(error);
                            });
                    });
                onStart();
                var elem = _react.default.createElement(
                    _react.default.Fragment,
                    null,
                    _react.default.createElement(Head, {
                        callback: onHeadCommit,
                    }),
                    _react.default.createElement(
                        AppContainer,
                        null,
                        renderApp(App, appProps),
                        _react.default.createElement(
                            _portal.Portal,
                            {
                                type: "next-route-announcer",
                            },
                            _react.default.createElement(
                                _routeAnnouncer.RouteAnnouncer,
                                null
                            )
                        )
                    )
                );
                return (
                    !(function (domEl, fn) {
                        _utils.ST && performance.mark("beforeRender");
                        var reactEl = fn(
                            shouldHydrate
                                ? markHydrateComplete
                                : markRenderComplete
                        );
                        if (reactRoot) {
                            var startTransition =
                                _react.default.startTransition;
                            startTransition(function () {
                                reactRoot.render(reactEl);
                            });
                        } else
                            (reactRoot = ReactDOM.hydrateRoot(domEl, reactEl)),
                                (shouldHydrate = !1);
                    })(appElement, function (callback) {
                        return _react.default.createElement(
                            Root,
                            {
                                callbacks: [callback, onRootCommit],
                            },
                            _react.default.createElement(
                                _react.default.StrictMode,
                                null,
                                elem
                            )
                        );
                    }),
                    renderPromise
                );
            }
            function Root(param) {
                var callbacks = param.callbacks,
                    children = param.children;
                return (
                    _react.default.useLayoutEffect(
                        function () {
                            return callbacks.forEach(function (callback) {
                                return callback();
                            });
                        },
                        [callbacks]
                    ),
                    _react.default.useEffect(function () {
                        _performanceRelayer.default(onPerfEntry);
                    }, []),
                    children
                );
            }
            function Head(param) {
                var callback = param.callback;
                return (
                    _react.default.useLayoutEffect(
                        function () {
                            return callback();
                        },
                        [callback]
                    ),
                    null
                );
            }
            ("function" == typeof exports.default ||
                ("object" == typeof exports.default &&
                    null !== exports.default)) &&
                void 0 === exports.default.__esModule &&
                (Object.defineProperty(exports.default, "__esModule", {
                    value: !0,
                }),
                Object.assign(exports.default, exports),
                (module.exports = exports.default));
        },
        2870: function (module, exports, __webpack_require__) {
            "use strict";
            var _ = __webpack_require__(7339);
            (window.next = {
                version: _.version,
                get router() {
                    return _.router;
                },
                emitter: _.emitter,
            }),
                _.initialize({})
                    .then(function () {
                        return _.hydrate();
                    })
                    .catch(console.error),
                ("function" == typeof exports.default ||
                    ("object" == typeof exports.default &&
                        null !== exports.default)) &&
                    void 0 === exports.default.__esModule &&
                    (Object.defineProperty(exports.default, "__esModule", {
                        value: !0,
                    }),
                    Object.assign(exports.default, exports),
                    (module.exports = exports.default));
        },
        2392: function (module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.normalizePathTrailingSlash = void 0);
            var _removeTrailingSlash = __webpack_require__(6316),
                _parsePath = __webpack_require__(4943);
            (exports.normalizePathTrailingSlash = function (path) {
                if (!path.startsWith("/")) return path;
                var ref = _parsePath.parsePath(path),
                    pathname = ref.pathname,
                    query = ref.query,
                    hash = ref.hash;
                return ""
                    .concat(_removeTrailingSlash.removeTrailingSlash(pathname))
                    .concat(query)
                    .concat(hash);
            }),
                ("function" == typeof exports.default ||
                    ("object" == typeof exports.default &&
                        null !== exports.default)) &&
                    void 0 === exports.default.__esModule &&
                    (Object.defineProperty(exports.default, "__esModule", {
                        value: !0,
                    }),
                    Object.assign(exports.default, exports),
                    (module.exports = exports.default));
        },
        5181: function (module, exports, __webpack_require__) {
            "use strict";
            var _class_call_check = __webpack_require__(9658).Z,
                _create_class = __webpack_require__(7222).Z,
                obj;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = void 0);
            var _addBasePath = __webpack_require__(8684),
                _router = __webpack_require__(6273),
                _getAssetPathFromRoute =
                    (obj = __webpack_require__(3891)) && obj.__esModule
                        ? obj
                        : {
                              default: obj,
                          },
                _addLocale = __webpack_require__(2725),
                _isDynamic = __webpack_require__(8689),
                _parseRelativeUrl = __webpack_require__(6305),
                _removeTrailingSlash = __webpack_require__(6316),
                _routeLoader = __webpack_require__(2669),
                PageLoader = (function () {
                    function PageLoader(buildId, assetPrefix) {
                        _class_call_check(this, PageLoader),
                            (this.routeLoader =
                                _routeLoader.createRouteLoader(assetPrefix)),
                            (this.buildId = buildId),
                            (this.assetPrefix = assetPrefix),
                            (this.promisedSsgManifest = new Promise(function (
                                resolve
                            ) {
                                window.__SSG_MANIFEST
                                    ? resolve(window.__SSG_MANIFEST)
                                    : (window.__SSG_MANIFEST_CB = function () {
                                          resolve(window.__SSG_MANIFEST);
                                      });
                            }));
                    }
                    return (
                        _create_class(PageLoader, [
                            {
                                key: "getPageList",
                                value: function () {
                                    return _routeLoader
                                        .getClientBuildManifest()
                                        .then(function (manifest) {
                                            return manifest.sortedPages;
                                        });
                                },
                            },
                            {
                                key: "getMiddlewareList",
                                value: function () {
                                    return (
                                        (window.__MIDDLEWARE_MANIFEST = []),
                                        window.__MIDDLEWARE_MANIFEST
                                    );
                                },
                            },
                            {
                                key: "getDataHref",
                                value: function (params) {
                                    var asPath = params.asPath,
                                        href = params.href,
                                        locale = params.locale,
                                        ref =
                                            _parseRelativeUrl.parseRelativeUrl(
                                                href
                                            ),
                                        hrefPathname = ref.pathname,
                                        query = ref.query,
                                        search = ref.search,
                                        ref1 =
                                            _parseRelativeUrl.parseRelativeUrl(
                                                asPath
                                            ),
                                        asPathname = ref1.pathname,
                                        route =
                                            _removeTrailingSlash.removeTrailingSlash(
                                                hrefPathname
                                            );
                                    if ("/" !== route[0])
                                        throw Error(
                                            'Route name should start with a "/", got "'.concat(
                                                route,
                                                '"'
                                            )
                                        );
                                    var path, dataRoute;
                                    return (
                                        (path = params.skipInterpolation
                                            ? asPathname
                                            : _isDynamic.isDynamicRoute(route)
                                            ? _router.interpolateAs(
                                                  hrefPathname,
                                                  asPathname,
                                                  query
                                              ).result
                                            : route),
                                        (dataRoute =
                                            _getAssetPathFromRoute.default(
                                                _removeTrailingSlash.removeTrailingSlash(
                                                    _addLocale.addLocale(
                                                        path,
                                                        locale
                                                    )
                                                ),
                                                ".json"
                                            )),
                                        _addBasePath.addBasePath(
                                            "/_next/data/"
                                                .concat(this.buildId)
                                                .concat(dataRoute)
                                                .concat(search),
                                            !0
                                        )
                                    );
                                },
                            },
                            {
                                key: "_isSsg",
                                value: function (route) {
                                    return this.promisedSsgManifest.then(
                                        function (manifest) {
                                            return manifest.has(route);
                                        }
                                    );
                                },
                            },
                            {
                                key: "loadPage",
                                value: function (route) {
                                    return this.routeLoader
                                        .loadRoute(route)
                                        .then(function (res) {
                                            if ("component" in res)
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
                                            throw res.error;
                                        });
                                },
                            },
                            {
                                key: "prefetch",
                                value: function (route) {
                                    return this.routeLoader.prefetch(route);
                                },
                            },
                        ]),
                        PageLoader
                    );
                })();
            (exports.default = PageLoader),
                ("function" == typeof exports.default ||
                    ("object" == typeof exports.default &&
                        null !== exports.default)) &&
                    void 0 === exports.default.__esModule &&
                    (Object.defineProperty(exports.default, "__esModule", {
                        value: !0,
                    }),
                    Object.assign(exports.default, exports),
                    (module.exports = exports.default));
        },
        9302: function (module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = void 0);
            var _webVitals = __webpack_require__(8745);
            location.href;
            var isRegistered = !1,
                userReportHandler;
            function onReport(metric) {
                userReportHandler && userReportHandler(metric);
            }
            (exports.default = function (onPerfEntry) {
                (userReportHandler = onPerfEntry),
                    isRegistered ||
                        ((isRegistered = !0),
                        _webVitals.onCLS(onReport),
                        _webVitals.onFID(onReport),
                        _webVitals.onFCP(onReport),
                        _webVitals.onLCP(onReport),
                        _webVitals.onTTFB(onReport),
                        _webVitals.onINP(onReport));
            }),
                ("function" == typeof exports.default ||
                    ("object" == typeof exports.default &&
                        null !== exports.default)) &&
                    void 0 === exports.default.__esModule &&
                    (Object.defineProperty(exports.default, "__esModule", {
                        value: !0,
                    }),
                    Object.assign(exports.default, exports),
                    (module.exports = exports.default));
        },
        2207: function (module, exports, __webpack_require__) {
            "use strict";
            var _sliced_to_array = __webpack_require__(4941).Z,
                obj;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.Portal = void 0);
            var _react =
                    (obj = __webpack_require__(7294)) && obj.__esModule
                        ? obj
                        : {
                              default: obj,
                          },
                _reactDom = __webpack_require__(3935);
            (exports.Portal = function (param) {
                var children = param.children,
                    type = param.type,
                    portalNode = _react.default.useRef(null),
                    ref = _sliced_to_array(_react.default.useState(), 2),
                    forceUpdate = ref[1];
                return (
                    _react.default.useEffect(
                        function () {
                            return (
                                (portalNode.current =
                                    document.createElement(type)),
                                document.body.appendChild(portalNode.current),
                                forceUpdate({}),
                                function () {
                                    portalNode.current &&
                                        document.body.removeChild(
                                            portalNode.current
                                        );
                                }
                            );
                        },
                        [type]
                    ),
                    portalNode.current
                        ? _reactDom.createPortal(children, portalNode.current)
                        : null
                );
            }),
                ("function" == typeof exports.default ||
                    ("object" == typeof exports.default &&
                        null !== exports.default)) &&
                    void 0 === exports.default.__esModule &&
                    (Object.defineProperty(exports.default, "__esModule", {
                        value: !0,
                    }),
                    Object.assign(exports.default, exports),
                    (module.exports = exports.default));
        },
        9320: function (module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.removeBasePath = function (path) {
                    return (
                        (path = path.slice(0)).startsWith("/") ||
                            (path = "/".concat(path)),
                        path
                    );
                }),
                __webpack_require__(4119),
                ("function" == typeof exports.default ||
                    ("object" == typeof exports.default &&
                        null !== exports.default)) &&
                    void 0 === exports.default.__esModule &&
                    (Object.defineProperty(exports.default, "__esModule", {
                        value: !0,
                    }),
                    Object.assign(exports.default, exports),
                    (module.exports = exports.default));
        },
        5776: function (module, exports, __webpack_require__) {
            "use strict";
            function removeLocale(path, locale) {
                return path;
            }
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.removeLocale = removeLocale),
                __webpack_require__(4943),
                ("function" == typeof exports.default ||
                    ("object" == typeof exports.default &&
                        null !== exports.default)) &&
                    void 0 === exports.default.__esModule &&
                    (Object.defineProperty(exports.default, "__esModule", {
                        value: !0,
                    }),
                    Object.assign(exports.default, exports),
                    (module.exports = exports.default));
        },
        9311: function (module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.cancelIdleCallback = exports.requestIdleCallback =
                    void 0);
            var requestIdleCallback =
                ("undefined" != typeof self &&
                    self.requestIdleCallback &&
                    self.requestIdleCallback.bind(window)) ||
                function (cb) {
                    var start = Date.now();
                    return setTimeout(function () {
                        cb({
                            didTimeout: !1,
                            timeRemaining: function () {
                                return Math.max(0, 50 - (Date.now() - start));
                            },
                        });
                    }, 1);
                };
            exports.requestIdleCallback = requestIdleCallback;
            var cancelIdleCallback =
                ("undefined" != typeof self &&
                    self.cancelIdleCallback &&
                    self.cancelIdleCallback.bind(window)) ||
                function (id) {
                    return clearTimeout(id);
                };
            (exports.cancelIdleCallback = cancelIdleCallback),
                ("function" == typeof exports.default ||
                    ("object" == typeof exports.default &&
                        null !== exports.default)) &&
                    void 0 === exports.default.__esModule &&
                    (Object.defineProperty(exports.default, "__esModule", {
                        value: !0,
                    }),
                    Object.assign(exports.default, exports),
                    (module.exports = exports.default));
        },
        8982: function (module, exports, __webpack_require__) {
            "use strict";
            var _sliced_to_array = __webpack_require__(4941).Z,
                obj;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.RouteAnnouncer = RouteAnnouncer),
                (exports.default = void 0);
            var _react =
                    (obj = __webpack_require__(7294)) && obj.__esModule
                        ? obj
                        : {
                              default: obj,
                          },
                _router = __webpack_require__(387);
            function RouteAnnouncer() {
                var asPath = _router.useRouter().asPath,
                    ref = _sliced_to_array(_react.default.useState(""), 2),
                    routeAnnouncement = ref[0],
                    setRouteAnnouncement = ref[1],
                    previouslyLoadedPath = _react.default.useRef(asPath);
                return (
                    _react.default.useEffect(
                        function () {
                            if (previouslyLoadedPath.current !== asPath) {
                                if (
                                    ((previouslyLoadedPath.current = asPath),
                                    document.title)
                                )
                                    setRouteAnnouncement(document.title);
                                else {
                                    var pageHeader =
                                            document.querySelector("h1"),
                                        ref,
                                        content =
                                            null !=
                                            (ref =
                                                null == pageHeader
                                                    ? void 0
                                                    : pageHeader.innerText)
                                                ? ref
                                                : null == pageHeader
                                                ? void 0
                                                : pageHeader.textContent;
                                    setRouteAnnouncement(content || asPath);
                                }
                            }
                        },
                        [asPath]
                    ),
                    _react.default.createElement(
                        "p",
                        {
                            "aria-live": "assertive",
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
                                whiteSpace: "nowrap",
                                wordWrap: "normal",
                            },
                        },
                        routeAnnouncement
                    )
                );
            }
            (exports.default = RouteAnnouncer),
                ("function" == typeof exports.default ||
                    ("object" == typeof exports.default &&
                        null !== exports.default)) &&
                    void 0 === exports.default.__esModule &&
                    (Object.defineProperty(exports.default, "__esModule", {
                        value: !0,
                    }),
                    Object.assign(exports.default, exports),
                    (module.exports = exports.default));
        },
        2669: function (module, exports, __webpack_require__) {
            "use strict";
            var obj;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.markAssetError = markAssetError),
                (exports.isAssetError = function (err) {
                    return err && ASSET_LOAD_ERROR in err;
                }),
                (exports.getClientBuildManifest = getClientBuildManifest),
                (exports.createRouteLoader = function (assetPrefix) {
                    var maybeExecuteScript = function (src) {
                            var prom = loadedScripts.get(src.toString());
                            if (prom) return prom;
                            if (
                                document.querySelector(
                                    'script[src^="'.concat(src, '"]')
                                )
                            )
                                return Promise.resolve();
                            var src1, script;
                            return (
                                loadedScripts.set(
                                    src.toString(),
                                    (prom =
                                        ((src1 = src),
                                        new Promise(function (resolve, reject) {
                                            ((script =
                                                document.createElement(
                                                    "script"
                                                )).onload = resolve),
                                                (script.onerror = function () {
                                                    return reject(
                                                        markAssetError(
                                                            Error(
                                                                "Failed to load script: ".concat(
                                                                    src1
                                                                )
                                                            )
                                                        )
                                                    );
                                                }),
                                                (script.crossOrigin = void 0),
                                                (script.src = src1),
                                                document.body.appendChild(
                                                    script
                                                );
                                        })))
                                ),
                                prom
                            );
                        },
                        fetchStyleSheet = function (href) {
                            var prom = styleSheets.get(href);
                            return (
                                prom ||
                                    styleSheets.set(
                                        href,
                                        (prom = fetch(href)
                                            .then(function (res) {
                                                if (!res.ok)
                                                    throw Error(
                                                        "Failed to load stylesheet: ".concat(
                                                            href
                                                        )
                                                    );
                                                return res
                                                    .text()
                                                    .then(function (text) {
                                                        return {
                                                            href: href,
                                                            content: text,
                                                        };
                                                    });
                                            })
                                            .catch(function (err) {
                                                throw markAssetError(err);
                                            }))
                                    ),
                                prom
                            );
                        },
                        entrypoints = new Map(),
                        loadedScripts = new Map(),
                        styleSheets = new Map(),
                        routes = new Map();
                    return {
                        whenEntrypoint: function (route) {
                            return withFuture(route, entrypoints);
                        },
                        onEntrypoint: function (route, execute) {
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
                                : Promise.resolve(void 0)
                            ).then(function (input) {
                                var old = entrypoints.get(route);
                                old && "resolve" in old
                                    ? input &&
                                      (entrypoints.set(route, input),
                                      old.resolve(input))
                                    : (input
                                          ? entrypoints.set(route, input)
                                          : entrypoints.delete(route),
                                      routes.delete(route));
                            });
                        },
                        loadRoute: function (route, prefetch) {
                            var _this = this;
                            return withFuture(route, routes, function () {
                                var _this1 = _this,
                                    devBuildPromiseResolve;
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
                                    3800,
                                    markAssetError(
                                        Error(
                                            "Route did not complete loading: ".concat(
                                                route
                                            )
                                        )
                                    )
                                )
                                    .then(function (param) {
                                        var entrypoint = param.entrypoint,
                                            styles = param.styles,
                                            res = Object.assign(
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
                                        if (prefetch) throw err;
                                        return {
                                            error: err,
                                        };
                                    })
                                    .finally(function () {
                                        return null == devBuildPromiseResolve
                                            ? void 0
                                            : devBuildPromiseResolve();
                                    });
                            });
                        },
                        prefetch: function (route) {
                            var _this = this,
                                cn;
                            return (cn = navigator.connection) &&
                                (cn.saveData || /2g/.test(cn.effectiveType))
                                ? Promise.resolve()
                                : getFilesForRoute(assetPrefix, route)
                                      .then(function (output) {
                                          return Promise.all(
                                              canPrefetch
                                                  ? output.scripts.map(
                                                        function (script) {
                                                            var href, as, link;
                                                            return (
                                                                (href =
                                                                    script.toString()),
                                                                (as = "script"),
                                                                new Promise(
                                                                    function (
                                                                        res,
                                                                        rej
                                                                    ) {
                                                                        var selector =
                                                                            '\n      link[rel="prefetch"][href^="'
                                                                                .concat(
                                                                                    href,
                                                                                    '"],\n      link[rel="preload"][href^="'
                                                                                )
                                                                                .concat(
                                                                                    href,
                                                                                    '"],\n      script[src^="'
                                                                                )
                                                                                .concat(
                                                                                    href,
                                                                                    '"]'
                                                                                );
                                                                        if (
                                                                            document.querySelector(
                                                                                selector
                                                                            )
                                                                        )
                                                                            return res();
                                                                        (link =
                                                                            document.createElement(
                                                                                "link"
                                                                            )),
                                                                            as &&
                                                                                (link.as =
                                                                                    as),
                                                                            (link.rel =
                                                                                "prefetch"),
                                                                            (link.crossOrigin =
                                                                                void 0),
                                                                            (link.onload =
                                                                                res),
                                                                            (link.onerror =
                                                                                rej),
                                                                            (link.href =
                                                                                href),
                                                                            document.head.appendChild(
                                                                                link
                                                                            );
                                                                    }
                                                                )
                                                            );
                                                        }
                                                    )
                                                  : []
                                          );
                                      })
                                      .then(function () {
                                          var _this1 = _this;
                                          _requestIdleCallback.requestIdleCallback(
                                              function () {
                                                  return _this1
                                                      .loadRoute(route, !0)
                                                      .catch(function () {});
                                              }
                                          );
                                      })
                                      .catch(function () {});
                        },
                    };
                }),
                (obj = __webpack_require__(3891)) && obj.__esModule;
            var _trustedTypes = __webpack_require__(4991),
                _requestIdleCallback = __webpack_require__(9311);
            function withFuture(key, map, generator) {
                var entry = map.get(key);
                if (entry)
                    return "future" in entry
                        ? entry.future
                        : Promise.resolve(entry);
                var resolver,
                    prom = new Promise(function (resolve) {
                        resolver = resolve;
                    });
                return (
                    map.set(
                        key,
                        (entry = {
                            resolve: resolver,
                            future: prom,
                        })
                    ),
                    generator
                        ? generator()
                              .then(function (value) {
                                  return resolver(value), value;
                              })
                              .catch(function (err) {
                                  throw (map.delete(key), err);
                              })
                        : prom
                );
            }
            var canPrefetch = (function (link) {
                    try {
                        return (
                            (link = document.createElement("link")),
                            (!!window.MSInputMethodContext &&
                                !!document.documentMode) ||
                                link.relList.supports("prefetch")
                        );
                    } catch (e) {
                        return !1;
                    }
                })(),
                ASSET_LOAD_ERROR = Symbol("ASSET_LOAD_ERROR");
            function markAssetError(err) {
                return Object.defineProperty(err, ASSET_LOAD_ERROR, {});
            }
            function resolvePromiseWithTimeout(p, ms, err) {
                return new Promise(function (resolve, reject) {
                    var cancelled = !1;
                    p
                        .then(function (r) {
                            (cancelled = !0), resolve(r);
                        })
                        .catch(reject),
                        _requestIdleCallback.requestIdleCallback(function () {
                            return setTimeout(function () {
                                cancelled || reject(err);
                            }, ms);
                        });
                });
            }
            function getClientBuildManifest() {
                if (self.__BUILD_MANIFEST)
                    return Promise.resolve(self.__BUILD_MANIFEST);
                var onBuildManifest = new Promise(function (resolve) {
                    var cb = self.__BUILD_MANIFEST_CB;
                    self.__BUILD_MANIFEST_CB = function () {
                        resolve(self.__BUILD_MANIFEST), cb && cb();
                    };
                });
                return resolvePromiseWithTimeout(
                    onBuildManifest,
                    3800,
                    markAssetError(
                        Error("Failed to load client build manifest")
                    )
                );
            }
            function getFilesForRoute(assetPrefix, route) {
                return getClientBuildManifest().then(function (manifest) {
                    if (!(route in manifest))
                        throw markAssetError(
                            Error("Failed to lookup route: ".concat(route))
                        );
                    var allFiles = manifest[route].map(function (entry) {
                        return assetPrefix + "/_next/" + encodeURI(entry);
                    });
                    return {
                        scripts: allFiles
                            .filter(function (v) {
                                return v.endsWith(".js");
                            })
                            .map(function (v) {
                                return _trustedTypes.__unsafeCreateTrustedScriptURL(
                                    v
                                );
                            }),
                        css: allFiles.filter(function (v) {
                            return v.endsWith(".css");
                        }),
                    };
                });
            }
            ("function" == typeof exports.default ||
                ("object" == typeof exports.default &&
                    null !== exports.default)) &&
                void 0 === exports.default.__esModule &&
                (Object.defineProperty(exports.default, "__esModule", {
                    value: !0,
                }),
                Object.assign(exports.default, exports),
                (module.exports = exports.default));
        },
        387: function (module, exports, __webpack_require__) {
            "use strict";
            var _construct = __webpack_require__(5317).default,
                _to_consumable_array = __webpack_require__(3929).Z;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                Object.defineProperty(exports, "Router", {
                    enumerable: !0,
                    get: function () {
                        return _router.default;
                    },
                }),
                Object.defineProperty(exports, "withRouter", {
                    enumerable: !0,
                    get: function () {
                        return _withRouter.default;
                    },
                }),
                (exports.useRouter = function () {
                    return _react.default.useContext(
                        _routerContext.RouterContext
                    );
                }),
                (exports.createRouter = function () {
                    for (
                        var _len = arguments.length,
                            args = Array(_len),
                            _key = 0;
                        _key < _len;
                        _key++
                    )
                        args[_key] = arguments[_key];
                    return (
                        (singletonRouter.router = _construct(
                            _router.default,
                            _to_consumable_array(args)
                        )),
                        singletonRouter.readyCallbacks.forEach(function (cb) {
                            return cb();
                        }),
                        (singletonRouter.readyCallbacks = []),
                        singletonRouter.router
                    );
                }),
                (exports.makePublicRouterInstance = function (router) {
                    var scopedRouter = router,
                        instance = {},
                        _iteratorNormalCompletion = !0,
                        _didIteratorError = !1,
                        _iteratorError = void 0;
                    try {
                        for (
                            var _iterator =
                                    urlPropertyFields[Symbol.iterator](),
                                _step;
                            !(_iteratorNormalCompletion = (_step =
                                _iterator.next()).done);
                            _iteratorNormalCompletion = !0
                        ) {
                            var property = _step.value;
                            if ("object" == typeof scopedRouter[property]) {
                                instance[property] = Object.assign(
                                    Array.isArray(scopedRouter[property])
                                        ? []
                                        : {},
                                    scopedRouter[property]
                                );
                                continue;
                            }
                            instance[property] = scopedRouter[property];
                        }
                    } catch (err) {
                        (_didIteratorError = !0), (_iteratorError = err);
                    } finally {
                        try {
                            _iteratorNormalCompletion ||
                                null == _iterator.return ||
                                _iterator.return();
                        } finally {
                            if (_didIteratorError) throw _iteratorError;
                        }
                    }
                    return (
                        (instance.events = _router.default.events),
                        coreMethodFields.forEach(function (field) {
                            instance[field] = function () {
                                for (
                                    var _len = arguments.length,
                                        args = Array(_len),
                                        _key = 0;
                                    _key < _len;
                                    _key++
                                )
                                    args[_key] = arguments[_key];
                                var _scopedRouter;
                                return (_scopedRouter = scopedRouter)[
                                    field
                                ].apply(
                                    _scopedRouter,
                                    _to_consumable_array(args)
                                );
                            };
                        }),
                        instance
                    );
                }),
                (exports.default = void 0);
            var _react = _interopRequireDefault(__webpack_require__(7294)),
                _router = _interopRequireDefault(__webpack_require__(6273)),
                _routerContext = __webpack_require__(3462),
                _isError = _interopRequireDefault(__webpack_require__(676)),
                _withRouter = _interopRequireDefault(__webpack_require__(8981));
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
                    ready: function (cb) {
                        if (this.router) return cb();
                        this.readyCallbacks.push(cb);
                    },
                },
                urlPropertyFields = [
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
                ],
                coreMethodFields = [
                    "push",
                    "replace",
                    "reload",
                    "back",
                    "prefetch",
                    "beforePopState",
                ];
            function getRouter() {
                if (!singletonRouter.router) {
                    var message =
                        'No router instance found.\nYou should only use "next/router" on the client side of your app.\n';
                    throw Error(message);
                }
                return singletonRouter.router;
            }
            Object.defineProperty(singletonRouter, "events", {
                get: function () {
                    return _router.default.events;
                },
            }),
                urlPropertyFields.forEach(function (field) {
                    Object.defineProperty(singletonRouter, field, {
                        get: function () {
                            var router = getRouter();
                            return router[field];
                        },
                    });
                }),
                coreMethodFields.forEach(function (field) {
                    singletonRouter[field] = function () {
                        for (
                            var _len = arguments.length,
                                args = Array(_len),
                                _key = 0;
                            _key < _len;
                            _key++
                        )
                            args[_key] = arguments[_key];
                        var _router,
                            router = getRouter();
                        return (_router = router)[field].apply(
                            _router,
                            _to_consumable_array(args)
                        );
                    };
                }),
                [
                    "routeChangeStart",
                    "beforeHistoryChange",
                    "routeChangeComplete",
                    "routeChangeError",
                    "hashChangeStart",
                    "hashChangeComplete",
                ].forEach(function (event) {
                    singletonRouter.ready(function () {
                        _router.default.events.on(event, function () {
                            for (
                                var _len = arguments.length,
                                    args = Array(_len),
                                    _key = 0;
                                _key < _len;
                                _key++
                            )
                                args[_key] = arguments[_key];
                            var eventField = "on"
                                    .concat(event.charAt(0).toUpperCase())
                                    .concat(event.substring(1)),
                                _singletonRouter = singletonRouter;
                            if (_singletonRouter[eventField])
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
                                    ),
                                        console.error(
                                            _isError.default(err)
                                                ? ""
                                                      .concat(err.message, "\n")
                                                      .concat(err.stack)
                                                : err + ""
                                        );
                                }
                        });
                    });
                }),
                (exports.default = singletonRouter),
                ("function" == typeof exports.default ||
                    ("object" == typeof exports.default &&
                        null !== exports.default)) &&
                    void 0 === exports.default.__esModule &&
                    (Object.defineProperty(exports.default, "__esModule", {
                        value: !0,
                    }),
                    Object.assign(exports.default, exports),
                    (module.exports = exports.default));
        },
        699: function (module, exports, __webpack_require__) {
            "use strict";
            var _sliced_to_array = __webpack_require__(4941).Z,
                _to_consumable_array = __webpack_require__(3929).Z;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.handleClientScriptLoad = handleClientScriptLoad),
                (exports.initScriptLoader = function (scriptLoaderItems) {
                    scriptLoaderItems.forEach(handleClientScriptLoad),
                        _to_consumable_array(
                            document.querySelectorAll(
                                '[data-nscript="beforeInteractive"]'
                            )
                        )
                            .concat(
                                _to_consumable_array(
                                    document.querySelectorAll(
                                        '[data-nscript="beforePageRender"]'
                                    )
                                )
                            )
                            .forEach(function (script) {
                                var cacheKey =
                                    script.id || script.getAttribute("src");
                                LoadCache.add(cacheKey);
                            });
                }),
                (exports.default = void 0);
            var _react = (function (obj) {
                    if (obj && obj.__esModule) return obj;
                    if (
                        null === obj ||
                        ("object" != typeof obj && "function" != typeof obj)
                    )
                        return {
                            default: obj,
                        };
                    var cache = _getRequireWildcardCache();
                    if (cache && cache.has(obj)) return cache.get(obj);
                    var newObj = {},
                        hasPropertyDescriptor =
                            Object.defineProperty &&
                            Object.getOwnPropertyDescriptor;
                    for (var key in obj)
                        if (Object.prototype.hasOwnProperty.call(obj, key)) {
                            var desc = hasPropertyDescriptor
                                ? Object.getOwnPropertyDescriptor(obj, key)
                                : null;
                            desc && (desc.get || desc.set)
                                ? Object.defineProperty(newObj, key, desc)
                                : (newObj[key] = obj[key]);
                        }
                    return (
                        (newObj.default = obj),
                        cache && cache.set(obj, newObj),
                        newObj
                    );
                })(__webpack_require__(7294)),
                _headManagerContext = __webpack_require__(8404),
                _headManager = __webpack_require__(6007),
                _requestIdleCallback = __webpack_require__(9311);
            function _extends() {
                return (_extends =
                    Object.assign ||
                    function (target) {
                        for (var i = 1; i < arguments.length; i++) {
                            var source = arguments[i];
                            for (var key in source)
                                Object.prototype.hasOwnProperty.call(
                                    source,
                                    key
                                ) && (target[key] = source[key]);
                        }
                        return target;
                    }).apply(this, arguments);
            }
            function _getRequireWildcardCache() {
                if ("function" != typeof WeakMap) return null;
                var cache = new WeakMap();
                return (
                    (_getRequireWildcardCache = function () {
                        return cache;
                    }),
                    cache
                );
            }
            var ScriptCache = new Map(),
                LoadCache = new Set(),
                ignoreProps = [
                    "onLoad",
                    "dangerouslySetInnerHTML",
                    "children",
                    "onError",
                    "strategy",
                ],
                loadScript = function (props) {
                    var src = props.src,
                        id = props.id,
                        _onLoad = props.onLoad,
                        onLoad = void 0 === _onLoad ? function () {} : _onLoad,
                        dangerouslySetInnerHTML = props.dangerouslySetInnerHTML,
                        _children = props.children,
                        children = void 0 === _children ? "" : _children,
                        _strategy = props.strategy,
                        strategy =
                            void 0 === _strategy
                                ? "afterInteractive"
                                : _strategy,
                        onError = props.onError,
                        cacheKey = id || src;
                    if (!(cacheKey && LoadCache.has(cacheKey))) {
                        if (ScriptCache.has(src)) {
                            LoadCache.add(cacheKey),
                                ScriptCache.get(src).then(onLoad, onError);
                            return;
                        }
                        var el = document.createElement("script"),
                            loadPromise = new Promise(function (
                                resolve,
                                reject
                            ) {
                                el.addEventListener("load", function (e) {
                                    resolve(), onLoad && onLoad.call(this, e);
                                }),
                                    el.addEventListener("error", function (e) {
                                        reject(e);
                                    });
                            }).catch(function (e) {
                                onError && onError(e);
                            });
                        src && ScriptCache.set(src, loadPromise),
                            LoadCache.add(cacheKey),
                            dangerouslySetInnerHTML
                                ? (el.innerHTML =
                                      dangerouslySetInnerHTML.__html || "")
                                : children
                                ? (el.textContent =
                                      "string" == typeof children
                                          ? children
                                          : Array.isArray(children)
                                          ? children.join("")
                                          : "")
                                : src && (el.src = src);
                        var _iteratorNormalCompletion = !0,
                            _didIteratorError = !1,
                            _iteratorError = void 0;
                        try {
                            for (
                                var _iterator =
                                        Object.entries(props)[
                                            Symbol.iterator
                                        ](),
                                    _step;
                                !(_iteratorNormalCompletion = (_step =
                                    _iterator.next()).done);
                                _iteratorNormalCompletion = !0
                            ) {
                                var _value = _sliced_to_array(_step.value, 2),
                                    k = _value[0],
                                    value = _value[1];
                                if (
                                    !(
                                        void 0 === value ||
                                        ignoreProps.includes(k)
                                    )
                                ) {
                                    var attr =
                                        _headManager.DOMAttributeNames[k] ||
                                        k.toLowerCase();
                                    el.setAttribute(attr, value);
                                }
                            }
                        } catch (err) {
                            (_didIteratorError = !0), (_iteratorError = err);
                        } finally {
                            try {
                                _iteratorNormalCompletion ||
                                    null == _iterator.return ||
                                    _iterator.return();
                            } finally {
                                if (_didIteratorError) throw _iteratorError;
                            }
                        }
                        "worker" === strategy &&
                            el.setAttribute("type", "text/partytown"),
                            el.setAttribute("data-nscript", strategy),
                            document.body.appendChild(el);
                    }
                };
            function handleClientScriptLoad(props) {
                var _strategy = props.strategy;
                "lazyOnload" ===
                (void 0 === _strategy ? "afterInteractive" : _strategy)
                    ? window.addEventListener("load", function () {
                          _requestIdleCallback.requestIdleCallback(function () {
                              return loadScript(props);
                          });
                      })
                    : loadScript(props);
            }
            (exports.default = function (props) {
                var _src = props.src,
                    src = void 0 === _src ? "" : _src,
                    _onLoad = props.onLoad,
                    _strategy = props.strategy,
                    strategy =
                        void 0 === _strategy ? "afterInteractive" : _strategy,
                    onError = props.onError,
                    restProps = (function (source, excluded) {
                        if (null == source) return {};
                        var target = {},
                            sourceKeys = Object.keys(source),
                            key,
                            i;
                        for (i = 0; i < sourceKeys.length; i++)
                            excluded.indexOf((key = sourceKeys[i])) >= 0 ||
                                (target[key] = source[key]);
                        return target;
                    })(props, ["src", "onLoad", "strategy", "onError"]),
                    ref = _react.useContext(
                        _headManagerContext.HeadManagerContext
                    ),
                    updateScripts = ref.updateScripts,
                    scripts = ref.scripts,
                    getIsSsr = ref.getIsSsr;
                return (
                    _react.useEffect(
                        function () {
                            if ("afterInteractive" === strategy)
                                loadScript(props);
                            else if ("lazyOnload" === strategy) {
                                var props1;
                                (props1 = props),
                                    "complete" === document.readyState
                                        ? _requestIdleCallback.requestIdleCallback(
                                              function () {
                                                  return loadScript(props1);
                                              }
                                          )
                                        : window.addEventListener(
                                              "load",
                                              function () {
                                                  _requestIdleCallback.requestIdleCallback(
                                                      function () {
                                                          return loadScript(
                                                              props1
                                                          );
                                                      }
                                                  );
                                              }
                                          );
                            }
                        },
                        [props, strategy]
                    ),
                    ("beforeInteractive" === strategy ||
                        "worker" === strategy) &&
                        (updateScripts
                            ? ((scripts[strategy] = (
                                  scripts[strategy] || []
                              ).concat([
                                  _extends(
                                      {
                                          src: src,
                                          onLoad:
                                              void 0 === _onLoad
                                                  ? function () {}
                                                  : _onLoad,
                                          onError: onError,
                                      },
                                      restProps
                                  ),
                              ])),
                              updateScripts(scripts))
                            : getIsSsr && getIsSsr()
                            ? LoadCache.add(restProps.id || src)
                            : getIsSsr && !getIsSsr() && loadScript(props)),
                    null
                );
            }),
                ("function" == typeof exports.default ||
                    ("object" == typeof exports.default &&
                        null !== exports.default)) &&
                    void 0 === exports.default.__esModule &&
                    (Object.defineProperty(exports.default, "__esModule", {
                        value: !0,
                    }),
                    Object.assign(exports.default, exports),
                    (module.exports = exports.default));
        },
        4991: function (module, exports) {
            "use strict";
            var policy;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.__unsafeCreateTrustedScriptURL = function (url) {
                    var ref;
                    return (
                        (null ==
                        (ref = (function () {
                            if (void 0 === policy) {
                                var ref;
                                policy =
                                    (null == (ref = window.trustedTypes)
                                        ? void 0
                                        : ref.createPolicy("nextjs", {
                                              createHTML: function (input) {
                                                  return input;
                                              },
                                              createScript: function (input) {
                                                  return input;
                                              },
                                              createScriptURL: function (
                                                  input
                                              ) {
                                                  return input;
                                              },
                                          })) || null;
                            }
                            return policy;
                        })())
                            ? void 0
                            : ref.createScriptURL(url)) || url
                    );
                }),
                ("function" == typeof exports.default ||
                    ("object" == typeof exports.default &&
                        null !== exports.default)) &&
                    void 0 === exports.default.__esModule &&
                    (Object.defineProperty(exports.default, "__esModule", {
                        value: !0,
                    }),
                    Object.assign(exports.default, exports),
                    (module.exports = exports.default));
        },
        8981: function (module, exports, __webpack_require__) {
            "use strict";
            var obj;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function (ComposedComponent) {
                    var WithRouterWrapper = function (props) {
                        return _react.default.createElement(
                            ComposedComponent,
                            Object.assign(
                                {
                                    router: _router.useRouter(),
                                },
                                props
                            )
                        );
                    };
                    return (
                        (WithRouterWrapper.getInitialProps =
                            ComposedComponent.getInitialProps),
                        (WithRouterWrapper.origGetInitialProps =
                            ComposedComponent.origGetInitialProps),
                        WithRouterWrapper
                    );
                });
            var _react =
                    (obj = __webpack_require__(7294)) && obj.__esModule
                        ? obj
                        : {
                              default: obj,
                          },
                _router = __webpack_require__(387);
            ("function" == typeof exports.default ||
                ("object" == typeof exports.default &&
                    null !== exports.default)) &&
                void 0 === exports.default.__esModule &&
                (Object.defineProperty(exports.default, "__esModule", {
                    value: !0,
                }),
                Object.assign(exports.default, exports),
                (module.exports = exports.default));
        },
        9185: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var _class_call_check = __webpack_require__(9658).Z,
                _create_class = __webpack_require__(7222).Z,
                _inherits = __webpack_require__(7788).Z,
                _create_super = __webpack_require__(7735).Z;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = void 0);
            var _react = _interopRequireDefault(__webpack_require__(7294)),
                _head = _interopRequireDefault(__webpack_require__(5443));
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
                    err = param.err,
                    statusCode =
                        res && res.statusCode
                            ? res.statusCode
                            : err
                            ? err.statusCode
                            : 404;
                return {
                    statusCode: statusCode,
                };
            }
            var Error1 = (function (_superClass) {
                _inherits(Error1, _superClass);
                var _super = _create_super(Error1);
                function Error1() {
                    return (
                        _class_call_check(this, Error1),
                        _super.apply(this, arguments)
                    );
                }
                return (
                    _create_class(Error1, [
                        {
                            key: "render",
                            value: function () {
                                var _props = this.props,
                                    statusCode = _props.statusCode,
                                    _withDarkMode = _props.withDarkMode,
                                    title =
                                        this.props.title ||
                                        statusCodes[statusCode] ||
                                        "An unexpected error has occurred";
                                return _react.default.createElement(
                                    "div",
                                    {
                                        style: styles.error,
                                    },
                                    _react.default.createElement(
                                        _head.default,
                                        null,
                                        _react.default.createElement(
                                            "title",
                                            null,
                                            statusCode
                                                ? ""
                                                      .concat(statusCode, ": ")
                                                      .concat(title)
                                                : "Application error: a client-side exception has occurred"
                                        )
                                    ),
                                    _react.default.createElement(
                                        "div",
                                        null,
                                        _react.default.createElement("style", {
                                            dangerouslySetInnerHTML: {
                                                __html: "\n                body { margin: 0; color: #000; background: #fff; }\n                .next-error-h1 {\n                  border-right: 1px solid rgba(0, 0, 0, .3);\n                }\n                \n                ".concat(
                                                    void 0 === _withDarkMode ||
                                                        _withDarkMode
                                                        ? "@media (prefers-color-scheme: dark) {\n                  body { color: #fff; background: #000; }\n                  .next-error-h1 {\n                    border-right: 1px solid rgba(255, 255, 255, .3);\n                  }\n                }"
                                                        : ""
                                                ),
                                            },
                                        }),
                                        statusCode
                                            ? _react.default.createElement(
                                                  "h1",
                                                  {
                                                      className:
                                                          "next-error-h1",
                                                      style: styles.h1,
                                                  },
                                                  statusCode
                                              )
                                            : null,
                                        _react.default.createElement(
                                            "div",
                                            {
                                                style: styles.desc,
                                            },
                                            _react.default.createElement(
                                                "h2",
                                                {
                                                    style: styles.h2,
                                                },
                                                this.props.title || statusCode
                                                    ? title
                                                    : _react.default.createElement(
                                                          _react.default
                                                              .Fragment,
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
                    ]),
                    Error1
                );
            })(_react.default.Component);
            (Error1.displayName = "ErrorPage"),
                (Error1.getInitialProps = _getInitialProps),
                (Error1.origGetInitialProps = _getInitialProps);
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
            exports.default = Error1;
        },
        2227: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var obj;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.AmpStateContext = void 0);
            var _react =
                    (obj = __webpack_require__(7294)) && obj.__esModule
                        ? obj
                        : {
                              default: obj,
                          },
                AmpStateContext = _react.default.createContext({});
            exports.AmpStateContext = AmpStateContext;
        },
        7363: function (__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.isInAmpMode = function () {
                    var ref =
                            arguments.length > 0 && void 0 !== arguments[0]
                                ? arguments[0]
                                : {},
                        _ampFirst = ref.ampFirst,
                        _hybrid = ref.hybrid,
                        _hasQuery = ref.hasQuery;
                    return (
                        (void 0 !== _ampFirst && _ampFirst) ||
                        (void 0 !== _hybrid &&
                            _hybrid &&
                            void 0 !== _hasQuery &&
                            _hasQuery)
                    );
                });
        },
        489: function (__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.escapeStringRegexp = function (str) {
                    return reHasRegExp.test(str)
                        ? str.replace(reReplaceRegExp, "\\$&")
                        : str;
                });
            var reHasRegExp = /[|\\{}()[\]^$+*?.-]/,
                reReplaceRegExp = /[|\\{}()[\]^$+*?.-]/g;
        },
        8404: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var obj;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.HeadManagerContext = void 0);
            var _react =
                    (obj = __webpack_require__(7294)) && obj.__esModule
                        ? obj
                        : {
                              default: obj,
                          },
                HeadManagerContext = _react.default.createContext({});
            exports.HeadManagerContext = HeadManagerContext;
        },
        5443: function (module, exports, __webpack_require__) {
            "use strict";
            var _object_spread = __webpack_require__(337).Z,
                obj;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.defaultHead = defaultHead),
                (exports.default = void 0);
            var _react = (function (obj) {
                    if (obj && obj.__esModule) return obj;
                    if (
                        null === obj ||
                        ("object" != typeof obj && "function" != typeof obj)
                    )
                        return {
                            default: obj,
                        };
                    var cache = _getRequireWildcardCache();
                    if (cache && cache.has(obj)) return cache.get(obj);
                    var newObj = {},
                        hasPropertyDescriptor =
                            Object.defineProperty &&
                            Object.getOwnPropertyDescriptor;
                    for (var key in obj)
                        if (Object.prototype.hasOwnProperty.call(obj, key)) {
                            var desc = hasPropertyDescriptor
                                ? Object.getOwnPropertyDescriptor(obj, key)
                                : null;
                            desc && (desc.get || desc.set)
                                ? Object.defineProperty(newObj, key, desc)
                                : (newObj[key] = obj[key]);
                        }
                    return (
                        (newObj.default = obj),
                        cache && cache.set(obj, newObj),
                        newObj
                    );
                })(__webpack_require__(7294)),
                _sideEffect =
                    (obj = __webpack_require__(5188)) && obj.__esModule
                        ? obj
                        : {
                              default: obj,
                          },
                _ampContext = __webpack_require__(2227),
                _headManagerContext = __webpack_require__(8404),
                _ampMode = __webpack_require__(7363);
            function _getRequireWildcardCache() {
                if ("function" != typeof WeakMap) return null;
                var cache = new WeakMap();
                return (
                    (_getRequireWildcardCache = function () {
                        return cache;
                    }),
                    cache
                );
            }
            function defaultHead() {
                var inAmpMode =
                        arguments.length > 0 &&
                        void 0 !== arguments[0] &&
                        arguments[0],
                    head = [
                        _react.default.createElement("meta", {
                            charSet: "utf-8",
                        }),
                    ];
                return (
                    inAmpMode ||
                        head.push(
                            _react.default.createElement("meta", {
                                name: "viewport",
                                content: "width=device-width",
                            })
                        ),
                    head
                );
            }
            function onlyReactElement(list, child) {
                return "string" == typeof child || "number" == typeof child
                    ? list
                    : child.type === _react.default.Fragment
                    ? list.concat(
                          _react.default.Children.toArray(
                              child.props.children
                          ).reduce(function (fragmentList, fragmentChild) {
                              return "string" == typeof fragmentChild ||
                                  "number" == typeof fragmentChild
                                  ? fragmentList
                                  : fragmentList.concat(fragmentChild);
                          }, [])
                      )
                    : list.concat(child);
            }
            __webpack_require__(3794);
            var METATYPES = ["name", "httpEquiv", "charSet", "itemProp"];
            function reduceComponents(headChildrenElements, props) {
                var keys, tags, metaTypes, metaCategories;
                return headChildrenElements
                    .reduce(onlyReactElement, [])
                    .reverse()
                    .concat(defaultHead(props.inAmpMode).reverse())
                    .filter(
                        ((keys = new Set()),
                        (tags = new Set()),
                        (metaTypes = new Set()),
                        (metaCategories = {}),
                        function (h) {
                            var isUnique = !0,
                                hasKey = !1;
                            if (
                                h.key &&
                                "number" != typeof h.key &&
                                h.key.indexOf("$") > 0
                            ) {
                                hasKey = !0;
                                var key = h.key.slice(h.key.indexOf("$") + 1);
                                keys.has(key) ? (isUnique = !1) : keys.add(key);
                            }
                            switch (h.type) {
                                case "title":
                                case "base":
                                    tags.has(h.type)
                                        ? (isUnique = !1)
                                        : tags.add(h.type);
                                    break;
                                case "meta":
                                    for (
                                        var i = 0, len = METATYPES.length;
                                        i < len;
                                        i++
                                    ) {
                                        var metatype = METATYPES[i];
                                        if (h.props.hasOwnProperty(metatype)) {
                                            if ("charSet" === metatype)
                                                metaTypes.has(metatype)
                                                    ? (isUnique = !1)
                                                    : metaTypes.add(metatype);
                                            else {
                                                var category =
                                                        h.props[metatype],
                                                    categories =
                                                        metaCategories[
                                                            metatype
                                                        ] || new Set();
                                                ("name" !== metatype ||
                                                    !hasKey) &&
                                                categories.has(category)
                                                    ? (isUnique = !1)
                                                    : (categories.add(category),
                                                      (metaCategories[
                                                          metatype
                                                      ] = categories));
                                            }
                                        }
                                    }
                            }
                            return isUnique;
                        })
                    )
                    .reverse()
                    .map(function (c, i) {
                        var key = c.key || i;
                        if (
                            !props.inAmpMode &&
                            "link" === c.type &&
                            c.props.href &&
                            [
                                "https://fonts.googleapis.com/css",
                                "https://use.typekit.net/",
                            ].some(function (url) {
                                return c.props.href.startsWith(url);
                            })
                        ) {
                            var newProps = _object_spread({}, c.props || {});
                            return (
                                (newProps["data-href"] = newProps.href),
                                (newProps.href = void 0),
                                (newProps["data-optimized-fonts"] = !0),
                                _react.default.cloneElement(c, newProps)
                            );
                        }
                        return _react.default.cloneElement(c, {
                            key: key,
                        });
                    });
            }
            (exports.default = function (param) {
                var children = param.children,
                    ampState = _react.useContext(_ampContext.AmpStateContext),
                    headManager = _react.useContext(
                        _headManagerContext.HeadManagerContext
                    );
                return _react.default.createElement(
                    _sideEffect.default,
                    {
                        reduceComponentsToState: reduceComponents,
                        headManager: headManager,
                        inAmpMode: _ampMode.isInAmpMode(ampState),
                    },
                    children
                );
            }),
                ("function" == typeof exports.default ||
                    ("object" == typeof exports.default &&
                        null !== exports.default)) &&
                    void 0 === exports.default.__esModule &&
                    (Object.defineProperty(exports.default, "__esModule", {
                        value: !0,
                    }),
                    Object.assign(exports.default, exports),
                    (module.exports = exports.default));
        },
        4317: function (__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.normalizeLocalePath = function (pathname, locales) {
                    var detectedLocale,
                        pathnameParts = pathname.split("/");
                    return (
                        (locales || []).some(function (locale) {
                            return (
                                !!pathnameParts[1] &&
                                pathnameParts[1].toLowerCase() ===
                                    locale.toLowerCase() &&
                                ((detectedLocale = locale),
                                pathnameParts.splice(1, 1),
                                (pathname = pathnameParts.join("/") || "/"),
                                !0)
                            );
                        }),
                        {
                            pathname: pathname,
                            detectedLocale: detectedLocale,
                        }
                    );
                });
        },
        9977: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var obj;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.ImageConfigContext = void 0);
            var _react =
                    (obj = __webpack_require__(7294)) && obj.__esModule
                        ? obj
                        : {
                              default: obj,
                          },
                _imageConfig = __webpack_require__(9309),
                ImageConfigContext = _react.default.createContext(
                    _imageConfig.imageConfigDefault
                );
            exports.ImageConfigContext = ImageConfigContext;
        },
        9309: function (__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.imageConfigDefault = exports.VALID_LOADERS = void 0),
                (exports.VALID_LOADERS = [
                    "default",
                    "imgix",
                    "cloudinary",
                    "akamai",
                    "custom",
                ]),
                (exports.imageConfigDefault = {
                    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
                    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
                    path: "/_next/image",
                    loader: "default",
                    domains: [],
                    disableStaticImages: !1,
                    minimumCacheTTL: 60,
                    formats: ["image/webp"],
                    dangerouslyAllowSVG: !1,
                    contentSecurityPolicy:
                        "script-src 'none'; frame-src 'none'; sandbox;",
                });
        },
        8887: function (__unused_webpack_module, exports) {
            "use strict";
            function getObjectClassLabel(value) {
                return Object.prototype.toString.call(value);
            }
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.getObjectClassLabel = getObjectClassLabel),
                (exports.isPlainObject = function (value) {
                    if ("[object Object]" !== getObjectClassLabel(value))
                        return !1;
                    var prototype = Object.getPrototypeOf(value);
                    return (
                        null === prototype ||
                        prototype.hasOwnProperty("isPrototypeOf")
                    );
                });
        },
        5660: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var _to_consumable_array = __webpack_require__(3929).Z;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function () {
                    var all = Object.create(null);
                    return {
                        on: function (type, handler) {
                            (all[type] || (all[type] = [])).push(handler);
                        },
                        off: function (type, handler) {
                            all[type] &&
                                all[type].splice(
                                    all[type].indexOf(handler) >>> 0,
                                    1
                                );
                        },
                        emit: function (type) {
                            for (
                                var _len = arguments.length,
                                    evts = Array(_len > 1 ? _len - 1 : 0),
                                    _key = 1;
                                _key < _len;
                                _key++
                            )
                                evts[_key - 1] = arguments[_key];
                            (all[type] || []).slice().map(function (handler) {
                                handler.apply(
                                    void 0,
                                    _to_consumable_array(evts)
                                );
                            });
                        },
                    };
                });
        },
        8317: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.denormalizePagePath = function (page) {
                    var _page = _normalizePathSep.normalizePathSep(page);
                    return _page.startsWith("/index/") &&
                        !_utils.isDynamicRoute(_page)
                        ? _page.slice(6)
                        : "/index" !== _page
                        ? _page
                        : "/";
                });
            var _utils = __webpack_require__(418),
                _normalizePathSep = __webpack_require__(9892);
        },
        9892: function (__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.normalizePathSep = function (path) {
                    return path.replace(/\\/g, "/");
                });
        },
        3462: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var obj;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.RouterContext = void 0);
            var _react =
                    (obj = __webpack_require__(7294)) && obj.__esModule
                        ? obj
                        : {
                              default: obj,
                          },
                RouterContext = _react.default.createContext(null);
            exports.RouterContext = RouterContext;
        },
        6273: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var _async_to_generator = __webpack_require__(932).Z,
                _class_call_check = __webpack_require__(9658).Z,
                _create_class = __webpack_require__(7222).Z,
                _define_property = __webpack_require__(9361).default,
                _interop_require_default = __webpack_require__(2648).Z,
                _object_spread = __webpack_require__(337).Z,
                _object_spread_props = __webpack_require__(9961).Z,
                _sliced_to_array = __webpack_require__(4941).Z,
                _runtimeJs = _interop_require_default(
                    __webpack_require__(4051)
                );
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.isLocalURL = isLocalURL),
                (exports.interpolateAs = interpolateAs),
                (exports.resolveHref = resolveHref),
                (exports.createKey = createKey),
                (exports.default = void 0);
            var _normalizeTrailingSlash = __webpack_require__(2392),
                _removeTrailingSlash = __webpack_require__(6316),
                _routeLoader = __webpack_require__(2669),
                _script = __webpack_require__(699),
                _isError = (function (obj) {
                    if (obj && obj.__esModule) return obj;
                    if (
                        null === obj ||
                        ("object" != typeof obj && "function" != typeof obj)
                    )
                        return {
                            default: obj,
                        };
                    var cache = _getRequireWildcardCache();
                    if (cache && cache.has(obj)) return cache.get(obj);
                    var newObj = {},
                        hasPropertyDescriptor =
                            Object.defineProperty &&
                            Object.getOwnPropertyDescriptor;
                    for (var key in obj)
                        if (Object.prototype.hasOwnProperty.call(obj, key)) {
                            var desc = hasPropertyDescriptor
                                ? Object.getOwnPropertyDescriptor(obj, key)
                                : null;
                            desc && (desc.get || desc.set)
                                ? Object.defineProperty(newObj, key, desc)
                                : (newObj[key] = obj[key]);
                        }
                    return (
                        (newObj.default = obj),
                        cache && cache.set(obj, newObj),
                        newObj
                    );
                })(__webpack_require__(676)),
                _denormalizePagePath = __webpack_require__(8317),
                _normalizeLocalePath = __webpack_require__(4317),
                _mitt = _interopRequireDefault(__webpack_require__(5660)),
                _utils = __webpack_require__(3794),
                _isDynamic = __webpack_require__(8689),
                _parseRelativeUrl = __webpack_require__(6305),
                _querystring = __webpack_require__(466),
                _resolveRewrites = _interopRequireDefault(
                    __webpack_require__(2431)
                ),
                _routeMatcher = __webpack_require__(3888),
                _routeRegex = __webpack_require__(4095),
                _formatUrl = __webpack_require__(4611);
            __webpack_require__(8748);
            var _parsePath = __webpack_require__(4943),
                _addLocale = __webpack_require__(2725),
                _removeLocale = __webpack_require__(5776),
                _removeBasePath = __webpack_require__(9320),
                _addBasePath = __webpack_require__(8684),
                _hasBasePath = __webpack_require__(4119),
                _getNextPathnameInfo = __webpack_require__(159),
                _formatNextPathnameInfo = __webpack_require__(4022),
                Router = (function () {
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
                            isPreview =
                                (param.locales,
                                param.defaultLocale,
                                param.domainLocales,
                                param.isPreview),
                            isRsc = param.isRsc,
                            _this = this;
                        _class_call_check(this, Router),
                            _define_property(this, "sdc", {}),
                            _define_property(this, "isFirstPopStateEvent", !0),
                            _define_property(this, "_key", createKey()),
                            _define_property(this, "onPopState", function (e) {
                                var isFirstPopStateEvent =
                                    _this.isFirstPopStateEvent;
                                _this.isFirstPopStateEvent = !1;
                                var state = e.state;
                                if (!state) {
                                    var _$pathname = _this.pathname,
                                        _$query = _this.query;
                                    _this.changeState(
                                        "replaceState",
                                        _formatUrl.formatWithValidation({
                                            pathname:
                                                _addBasePath.addBasePath(
                                                    _$pathname
                                                ),
                                            query: _$query,
                                        }),
                                        _utils.getURL()
                                    );
                                    return;
                                }
                                if (
                                    state.__N &&
                                    (!isFirstPopStateEvent ||
                                        _this.locale !== state.options.locale ||
                                        state.as !== _this.asPath)
                                ) {
                                    var forcedScroll,
                                        url = state.url,
                                        _$as = state.as,
                                        options = state.options,
                                        key = state.key;
                                    _this._key = key;
                                    var _$pathname1 =
                                        _parseRelativeUrl.parseRelativeUrl(
                                            url
                                        ).pathname;
                                    (!_this.isSsr ||
                                        _$as !==
                                            _addBasePath.addBasePath(
                                                _this.asPath
                                            ) ||
                                        _$pathname1 !==
                                            _addBasePath.addBasePath(
                                                _this.pathname
                                            )) &&
                                        (!_this._bps || _this._bps(state)) &&
                                        _this.change(
                                            "replaceState",
                                            url,
                                            _$as,
                                            Object.assign({}, options, {
                                                shallow:
                                                    options.shallow &&
                                                    _this._shallow,
                                                locale:
                                                    options.locale ||
                                                    _this.defaultLocale,
                                                _h: 0,
                                            }),
                                            forcedScroll
                                        );
                                }
                            });
                        var route =
                            _removeTrailingSlash.removeTrailingSlash(pathname);
                        (this.components = {}),
                            "/_error" !== pathname &&
                                (this.components[route] = {
                                    Component: Component,
                                    initial: !0,
                                    props: initialProps,
                                    err: err,
                                    __N_SSG:
                                        initialProps && initialProps.__N_SSG,
                                    __N_SSP:
                                        initialProps && initialProps.__N_SSP,
                                    __N_RSC: !!isRsc,
                                }),
                            (this.components["/_app"] = {
                                Component: App,
                                styleSheets: [],
                            }),
                            (this.events = Router.events),
                            (this.pageLoader = pageLoader);
                        var autoExportDynamic =
                            _isDynamic.isDynamicRoute(pathname) &&
                            self.__NEXT_DATA__.autoExport;
                        if (
                            ((this.basePath = ""),
                            (this.sub = subscription),
                            (this.clc = null),
                            (this._wrapApp = wrapApp),
                            (this.isSsr = !0),
                            (this.isLocaleDomain = !1),
                            (this.isReady = !!(
                                self.__NEXT_DATA__.gssp ||
                                self.__NEXT_DATA__.gip ||
                                (self.__NEXT_DATA__.appGip &&
                                    !self.__NEXT_DATA__.gsp) ||
                                (!autoExportDynamic && !self.location.search)
                            )),
                            (this.state = {
                                route: route,
                                pathname: pathname,
                                query: query,
                                asPath: autoExportDynamic ? pathname : as,
                                isPreview: !!isPreview,
                                locale: void 0,
                                isFallback: isFallback,
                            }),
                            (this._initialMatchesMiddlewarePromise =
                                Promise.resolve(!1)),
                            !as.startsWith("//"))
                        ) {
                            var _this1 = this,
                                options = {
                                    locale: locale,
                                },
                                asPath = _utils.getURL();
                            this._initialMatchesMiddlewarePromise =
                                matchesMiddleware({
                                    router: this,
                                    locale: locale,
                                    asPath: asPath,
                                }).then(function (matches) {
                                    return (
                                        (options._shouldResolveHref =
                                            as !== pathname),
                                        _this1.changeState(
                                            "replaceState",
                                            matches
                                                ? asPath
                                                : _formatUrl.formatWithValidation(
                                                      {
                                                          pathname:
                                                              _addBasePath.addBasePath(
                                                                  pathname
                                                              ),
                                                          query: query,
                                                      }
                                                  ),
                                            asPath,
                                            options
                                        ),
                                        matches
                                    );
                                });
                        }
                        window.addEventListener("popstate", this.onPopState);
                    }
                    return (
                        _create_class(Router, [
                            {
                                key: "reload",
                                value: function () {
                                    window.location.reload();
                                },
                            },
                            {
                                key: "back",
                                value: function () {
                                    window.history.back();
                                },
                            },
                            {
                                key: "push",
                                value: function (url, as) {
                                    var options =
                                            arguments.length > 2 &&
                                            void 0 !== arguments[2]
                                                ? arguments[2]
                                                : {},
                                        ref;
                                    return (
                                        (url = (ref = prepareUrlAs(
                                            this,
                                            url,
                                            as
                                        )).url),
                                        (as = ref.as),
                                        this.change(
                                            "pushState",
                                            url,
                                            as,
                                            options
                                        )
                                    );
                                },
                            },
                            {
                                key: "replace",
                                value: function (url, as) {
                                    var options =
                                            arguments.length > 2 &&
                                            void 0 !== arguments[2]
                                                ? arguments[2]
                                                : {},
                                        ref;
                                    return (
                                        (url = (ref = prepareUrlAs(
                                            this,
                                            url,
                                            as
                                        )).url),
                                        (as = ref.as),
                                        this.change(
                                            "replaceState",
                                            url,
                                            as,
                                            options
                                        )
                                    );
                                },
                            },
                            {
                                key: "change",
                                value: function (
                                    method,
                                    url,
                                    as,
                                    options,
                                    forcedScroll
                                ) {
                                    var _this = this;
                                    return _async_to_generator(
                                        _runtimeJs.default.mark(
                                            function _callee() {
                                                var isQueryUpdating,
                                                    shouldResolveHref,
                                                    nextState,
                                                    isSsr,
                                                    prevLocale,
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
                                                    function (_ctx) {
                                                        for (;;)
                                                            switch (
                                                                (_ctx.prev =
                                                                    _ctx.next)
                                                            ) {
                                                                case 0:
                                                                    if (
                                                                        isLocalURL(
                                                                            url
                                                                        )
                                                                    ) {
                                                                        _ctx.next = 3;
                                                                        break;
                                                                    }
                                                                    return (
                                                                        handleHardNavigation(
                                                                            {
                                                                                url: url,
                                                                                router: _this,
                                                                            }
                                                                        ),
                                                                        _ctx.abrupt(
                                                                            "return",
                                                                            !1
                                                                        )
                                                                    );
                                                                case 3:
                                                                    if (
                                                                        ((shouldResolveHref =
                                                                            (isQueryUpdating =
                                                                                options._h) ||
                                                                            options._shouldResolveHref ||
                                                                            _parsePath.parsePath(
                                                                                url
                                                                            )
                                                                                .pathname ===
                                                                                _parsePath.parsePath(
                                                                                    as
                                                                                )
                                                                                    .pathname),
                                                                        (nextState =
                                                                            _object_spread(
                                                                                {},
                                                                                _this.state
                                                                            )),
                                                                        (_this.isReady =
                                                                            !0),
                                                                        (isSsr =
                                                                            _this.isSsr),
                                                                        isQueryUpdating ||
                                                                            (_this.isSsr =
                                                                                !1),
                                                                        !(
                                                                            isQueryUpdating &&
                                                                            _this.clc
                                                                        ))
                                                                    ) {
                                                                        _ctx.next = 11;
                                                                        break;
                                                                    }
                                                                    return _ctx.abrupt(
                                                                        "return",
                                                                        !1
                                                                    );
                                                                case 11:
                                                                    (prevLocale =
                                                                        nextState.locale),
                                                                        (_ctx.next = 24);
                                                                    break;
                                                                case 24:
                                                                    if (
                                                                        (_utils.ST &&
                                                                            performance.mark(
                                                                                "routeChange"
                                                                            ),
                                                                        (shallow =
                                                                            void 0 !==
                                                                                (_shallow =
                                                                                    options.shallow) &&
                                                                            _shallow),
                                                                        (_scroll =
                                                                            options.scroll),
                                                                        (scroll =
                                                                            void 0 ===
                                                                                _scroll ||
                                                                            _scroll),
                                                                        (routeProps =
                                                                            {
                                                                                shallow:
                                                                                    shallow,
                                                                            }),
                                                                        _this._inFlightRoute &&
                                                                            _this.clc &&
                                                                            (isSsr ||
                                                                                Router.events.emit(
                                                                                    "routeChangeError",
                                                                                    buildCancellationError(),
                                                                                    _this._inFlightRoute,
                                                                                    routeProps
                                                                                ),
                                                                            _this.clc(),
                                                                            (_this.clc =
                                                                                null)),
                                                                        (as =
                                                                            _addBasePath.addBasePath(
                                                                                _addLocale.addLocale(
                                                                                    _hasBasePath.hasBasePath(
                                                                                        as
                                                                                    )
                                                                                        ? _removeBasePath.removeBasePath(
                                                                                              as
                                                                                          )
                                                                                        : as,
                                                                                    options.locale,
                                                                                    _this.defaultLocale
                                                                                )
                                                                            )),
                                                                        (cleanedAs =
                                                                            _removeLocale.removeLocale(
                                                                                _hasBasePath.hasBasePath(
                                                                                    as
                                                                                )
                                                                                    ? _removeBasePath.removeBasePath(
                                                                                          as
                                                                                      )
                                                                                    : as,
                                                                                nextState.locale
                                                                            )),
                                                                        (_this._inFlightRoute =
                                                                            as),
                                                                        (localeChange =
                                                                            prevLocale !==
                                                                            nextState.locale),
                                                                        !(
                                                                            !isQueryUpdating &&
                                                                            _this.onlyAHashChange(
                                                                                cleanedAs
                                                                            ) &&
                                                                            !localeChange
                                                                        ))
                                                                    ) {
                                                                        _ctx.next = 48;
                                                                        break;
                                                                    }
                                                                    return (
                                                                        (nextState.asPath =
                                                                            cleanedAs),
                                                                        Router.events.emit(
                                                                            "hashChangeStart",
                                                                            as,
                                                                            routeProps
                                                                        ),
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
                                                                                    scroll: !1,
                                                                                }
                                                                            )
                                                                        ),
                                                                        scroll &&
                                                                            _this.scrollToHash(
                                                                                cleanedAs
                                                                            ),
                                                                        (_ctx.prev = 37),
                                                                        (_ctx.next = 40),
                                                                        _this.set(
                                                                            nextState,
                                                                            _this
                                                                                .components[
                                                                                nextState
                                                                                    .route
                                                                            ],
                                                                            null
                                                                        )
                                                                    );
                                                                case 40:
                                                                    _ctx.next = 46;
                                                                    break;
                                                                case 42:
                                                                    throw (
                                                                        ((_ctx.prev = 42),
                                                                        (_ctx.t0 =
                                                                            _ctx.catch(
                                                                                37
                                                                            )),
                                                                        _isError.default(
                                                                            _ctx.t0
                                                                        ) &&
                                                                            _ctx
                                                                                .t0
                                                                                .cancelled &&
                                                                            Router.events.emit(
                                                                                "routeChangeError",
                                                                                _ctx.t0,
                                                                                cleanedAs,
                                                                                routeProps
                                                                            ),
                                                                        _ctx.t0)
                                                                    );
                                                                case 46:
                                                                    return (
                                                                        Router.events.emit(
                                                                            "hashChangeComplete",
                                                                            as,
                                                                            routeProps
                                                                        ),
                                                                        _ctx.abrupt(
                                                                            "return",
                                                                            !0
                                                                        )
                                                                    );
                                                                case 48:
                                                                    return (
                                                                        (pathname =
                                                                            (parsed =
                                                                                _parseRelativeUrl.parseRelativeUrl(
                                                                                    url
                                                                                ))
                                                                                .pathname),
                                                                        (query =
                                                                            parsed.query),
                                                                        (_ctx.prev = 51),
                                                                        (_ctx.t1 =
                                                                            _sliced_to_array),
                                                                        (_ctx.next = 56),
                                                                        Promise.all(
                                                                            [
                                                                                _this.pageLoader.getPageList(),
                                                                                _routeLoader.getClientBuildManifest(),
                                                                                _this.pageLoader.getMiddlewareList(),
                                                                            ]
                                                                        )
                                                                    );
                                                                case 56:
                                                                    (_ctx.t2 =
                                                                        _ctx.sent),
                                                                        (pages =
                                                                            (ref1 =
                                                                                (0,
                                                                                _ctx.t1)(
                                                                                    _ctx.t2,
                                                                                    2
                                                                                ))[0]),
                                                                        (rewrites =
                                                                            (ref2 =
                                                                                ref1[1])
                                                                                .__rewrites),
                                                                        (_ctx.next = 67);
                                                                    break;
                                                                case 63:
                                                                    return (
                                                                        (_ctx.prev = 63),
                                                                        (_ctx.t3 =
                                                                            _ctx.catch(
                                                                                51
                                                                            )),
                                                                        handleHardNavigation(
                                                                            {
                                                                                url: as,
                                                                                router: _this,
                                                                            }
                                                                        ),
                                                                        _ctx.abrupt(
                                                                            "return",
                                                                            !1
                                                                        )
                                                                    );
                                                                case 67:
                                                                    if (
                                                                        (_this.urlIsNew(
                                                                            cleanedAs
                                                                        ) ||
                                                                            localeChange ||
                                                                            (method =
                                                                                "replaceState"),
                                                                        (resolvedAs =
                                                                            as),
                                                                        (pathname =
                                                                            pathname
                                                                                ? _removeTrailingSlash.removeTrailingSlash(
                                                                                      _removeBasePath.removeBasePath(
                                                                                          pathname
                                                                                      )
                                                                                  )
                                                                                : pathname),
                                                                        (_ctx.t4 =
                                                                            !options.shallow),
                                                                        !_ctx.t4)
                                                                    ) {
                                                                        _ctx.next = 75;
                                                                        break;
                                                                    }
                                                                    return (
                                                                        (_ctx.next = 74),
                                                                        matchesMiddleware(
                                                                            {
                                                                                asPath: as,
                                                                                locale: nextState.locale,
                                                                                router: _this,
                                                                            }
                                                                        )
                                                                    );
                                                                case 74:
                                                                    _ctx.t4 =
                                                                        _ctx.sent;
                                                                case 75:
                                                                    if (
                                                                        ((isMiddlewareMatch =
                                                                            _ctx.t4),
                                                                        !(
                                                                            shouldResolveHref &&
                                                                            "/_error" !==
                                                                                pathname
                                                                        ))
                                                                    ) {
                                                                        _ctx.next = 88;
                                                                        break;
                                                                    }
                                                                    (options._shouldResolveHref =
                                                                        !0),
                                                                        (_ctx.next = 87);
                                                                    break;
                                                                case 83:
                                                                    isMiddlewareMatch ||
                                                                        (resolvedAs =
                                                                            rewritesResult.asPath),
                                                                        rewritesResult.matchedPage &&
                                                                            rewritesResult.resolvedHref &&
                                                                            ((pathname =
                                                                                rewritesResult.resolvedHref),
                                                                            (parsed.pathname =
                                                                                _addBasePath.addBasePath(
                                                                                    pathname
                                                                                )),
                                                                            isMiddlewareMatch ||
                                                                                (url =
                                                                                    _formatUrl.formatWithValidation(
                                                                                        parsed
                                                                                    ))),
                                                                        (_ctx.next = 88);
                                                                    break;
                                                                case 87:
                                                                    (parsed.pathname =
                                                                        resolveDynamicRoute(
                                                                            pathname,
                                                                            pages
                                                                        )),
                                                                        parsed.pathname ===
                                                                            pathname ||
                                                                            ((pathname =
                                                                                parsed.pathname),
                                                                            (parsed.pathname =
                                                                                _addBasePath.addBasePath(
                                                                                    pathname
                                                                                )),
                                                                            isMiddlewareMatch ||
                                                                                (url =
                                                                                    _formatUrl.formatWithValidation(
                                                                                        parsed
                                                                                    )));
                                                                case 88:
                                                                    if (
                                                                        isLocalURL(
                                                                            as
                                                                        )
                                                                    ) {
                                                                        _ctx.next = 93;
                                                                        break;
                                                                    }
                                                                    _ctx.next = 91;
                                                                    break;
                                                                case 91:
                                                                    return (
                                                                        handleHardNavigation(
                                                                            {
                                                                                url: as,
                                                                                router: _this,
                                                                            }
                                                                        ),
                                                                        _ctx.abrupt(
                                                                            "return",
                                                                            !1
                                                                        )
                                                                    );
                                                                case 93:
                                                                    if (
                                                                        ((resolvedAs =
                                                                            _removeLocale.removeLocale(
                                                                                _removeBasePath.removeBasePath(
                                                                                    resolvedAs
                                                                                ),
                                                                                nextState.locale
                                                                            )),
                                                                        (route =
                                                                            _removeTrailingSlash.removeTrailingSlash(
                                                                                pathname
                                                                            )),
                                                                        (routeMatch =
                                                                            !1),
                                                                        !_isDynamic.isDynamicRoute(
                                                                            route
                                                                        ))
                                                                    ) {
                                                                        _ctx.next = 111;
                                                                        break;
                                                                    }
                                                                    if (
                                                                        ((asPathname =
                                                                            (parsedAs1 =
                                                                                _parseRelativeUrl.parseRelativeUrl(
                                                                                    resolvedAs
                                                                                ))
                                                                                .pathname),
                                                                        (routeRegex =
                                                                            _routeRegex.getRouteRegex(
                                                                                route
                                                                            )),
                                                                        (routeMatch =
                                                                            _routeMatcher.getRouteMatcher(
                                                                                routeRegex
                                                                            )(
                                                                                asPathname
                                                                            )),
                                                                        (shouldInterpolate =
                                                                            route ===
                                                                            asPathname),
                                                                        (interpolatedAs =
                                                                            shouldInterpolate
                                                                                ? interpolateAs(
                                                                                      route,
                                                                                      asPathname,
                                                                                      query
                                                                                  )
                                                                                : {}),
                                                                        !(
                                                                            !routeMatch ||
                                                                            (shouldInterpolate &&
                                                                                !interpolatedAs.result)
                                                                        ))
                                                                    ) {
                                                                        _ctx.next = 110;
                                                                        break;
                                                                    }
                                                                    if (
                                                                        !(
                                                                            (missingParams =
                                                                                Object.keys(
                                                                                    routeRegex.groups
                                                                                ).filter(
                                                                                    function (
                                                                                        param
                                                                                    ) {
                                                                                        return !query[
                                                                                            param
                                                                                        ];
                                                                                    }
                                                                                ))
                                                                                .length >
                                                                                0 &&
                                                                            !isMiddlewareMatch
                                                                        )
                                                                    ) {
                                                                        _ctx.next = 108;
                                                                        break;
                                                                    }
                                                                    throw Error(
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
                                                                    shouldInterpolate
                                                                        ? (as =
                                                                              _formatUrl.formatWithValidation(
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
                                                                              ))
                                                                        : Object.assign(
                                                                              query,
                                                                              routeMatch
                                                                          );
                                                                case 111:
                                                                    return (
                                                                        isQueryUpdating ||
                                                                            Router.events.emit(
                                                                                "routeChangeStart",
                                                                                as,
                                                                                routeProps
                                                                            ),
                                                                        (_ctx.prev = 112),
                                                                        (_ctx.next = 116),
                                                                        _this.getRouteInfo(
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
                                                                        )
                                                                    );
                                                                case 116:
                                                                    if (
                                                                        ("route" in
                                                                            (routeInfo =
                                                                                _ctx.sent) &&
                                                                            isMiddlewareMatch &&
                                                                            ((route =
                                                                                pathname =
                                                                                    routeInfo.route ||
                                                                                    route),
                                                                            (query =
                                                                                Object.assign(
                                                                                    {},
                                                                                    routeInfo.query ||
                                                                                        {},
                                                                                    query
                                                                                )),
                                                                            routeMatch &&
                                                                                pathname !==
                                                                                    parsed.pathname &&
                                                                                Object.keys(
                                                                                    routeMatch
                                                                                ).forEach(
                                                                                    function (
                                                                                        key
                                                                                    ) {
                                                                                        routeMatch &&
                                                                                            query[
                                                                                                key
                                                                                            ] ===
                                                                                                routeMatch[
                                                                                                    key
                                                                                                ] &&
                                                                                            delete query[
                                                                                                key
                                                                                            ];
                                                                                    }
                                                                                ),
                                                                            _isDynamic.isDynamicRoute(
                                                                                pathname
                                                                            )) &&
                                                                            ((rewriteAs =
                                                                                prefixedAs =
                                                                                    routeInfo.resolvedAs ||
                                                                                    _addBasePath.addBasePath(
                                                                                        _addLocale.addLocale(
                                                                                            as,
                                                                                            nextState.locale
                                                                                        ),
                                                                                        !0
                                                                                    )),
                                                                            _hasBasePath.hasBasePath(
                                                                                rewriteAs
                                                                            ) &&
                                                                                (rewriteAs =
                                                                                    _removeBasePath.removeBasePath(
                                                                                        rewriteAs
                                                                                    )),
                                                                            (routeRegex1 =
                                                                                _routeRegex.getRouteRegex(
                                                                                    pathname
                                                                                )),
                                                                            (curRouteMatch =
                                                                                _routeMatcher.getRouteMatcher(
                                                                                    routeRegex1
                                                                                )(
                                                                                    rewriteAs
                                                                                )) &&
                                                                                Object.assign(
                                                                                    query,
                                                                                    curRouteMatch
                                                                                )),
                                                                        !(
                                                                            "type" in
                                                                            routeInfo
                                                                        ))
                                                                    ) {
                                                                        _ctx.next = 125;
                                                                        break;
                                                                    }
                                                                    if (
                                                                        "redirect-internal" !==
                                                                        routeInfo.type
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
                                                                    return (
                                                                        handleHardNavigation(
                                                                            {
                                                                                url: routeInfo.destination,
                                                                                router: _this,
                                                                            }
                                                                        ),
                                                                        _ctx.abrupt(
                                                                            "return",
                                                                            new Promise(
                                                                                function () {}
                                                                            )
                                                                        )
                                                                    );
                                                                case 125:
                                                                    if (
                                                                        ((error =
                                                                            routeInfo.error),
                                                                        (props =
                                                                            routeInfo.props),
                                                                        (__N_SSG =
                                                                            routeInfo.__N_SSG),
                                                                        (__N_SSP =
                                                                            routeInfo.__N_SSP),
                                                                        (component =
                                                                            routeInfo.Component),
                                                                        component &&
                                                                            component.unstable_scriptLoader &&
                                                                            (scripts =
                                                                                [].concat(
                                                                                    component.unstable_scriptLoader()
                                                                                )).forEach(
                                                                                function (
                                                                                    script
                                                                                ) {
                                                                                    _script.handleClientScriptLoad(
                                                                                        script.props
                                                                                    );
                                                                                }
                                                                            ),
                                                                        !(
                                                                            (__N_SSG ||
                                                                                __N_SSP) &&
                                                                            props
                                                                        ))
                                                                    ) {
                                                                        _ctx.next = 156;
                                                                        break;
                                                                    }
                                                                    if (
                                                                        !(
                                                                            props.pageProps &&
                                                                            props
                                                                                .pageProps
                                                                                .__N_REDIRECT
                                                                        )
                                                                    ) {
                                                                        _ctx.next = 139;
                                                                        break;
                                                                    }
                                                                    if (
                                                                        ((options.locale =
                                                                            !1),
                                                                        !(
                                                                            (destination =
                                                                                props
                                                                                    .pageProps
                                                                                    .__N_REDIRECT).startsWith(
                                                                                "/"
                                                                            ) &&
                                                                            !1 !==
                                                                                props
                                                                                    .pageProps
                                                                                    .__N_REDIRECT_BASE_PATH
                                                                        ))
                                                                    ) {
                                                                        _ctx.next = 137;
                                                                        break;
                                                                    }
                                                                    return (
                                                                        ((parsedHref =
                                                                            _parseRelativeUrl.parseRelativeUrl(
                                                                                destination
                                                                            )).pathname =
                                                                            resolveDynamicRoute(
                                                                                parsedHref.pathname,
                                                                                pages
                                                                            )),
                                                                        (newUrl =
                                                                            (ref3 =
                                                                                prepareUrlAs(
                                                                                    _this,
                                                                                    destination,
                                                                                    destination
                                                                                ))
                                                                                .url),
                                                                        (newAs =
                                                                            ref3.as),
                                                                        _ctx.abrupt(
                                                                            "return",
                                                                            _this.change(
                                                                                method,
                                                                                newUrl,
                                                                                newAs,
                                                                                options
                                                                            )
                                                                        )
                                                                    );
                                                                case 137:
                                                                    return (
                                                                        handleHardNavigation(
                                                                            {
                                                                                url: destination,
                                                                                router: _this,
                                                                            }
                                                                        ),
                                                                        _ctx.abrupt(
                                                                            "return",
                                                                            new Promise(
                                                                                function () {}
                                                                            )
                                                                        )
                                                                    );
                                                                case 139:
                                                                    if (
                                                                        ((nextState.isPreview =
                                                                            !!props.__N_PREVIEW),
                                                                        props.notFound !==
                                                                            SSG_DATA_NOT_FOUND)
                                                                    ) {
                                                                        _ctx.next = 156;
                                                                        break;
                                                                    }
                                                                    return (
                                                                        (_ctx.prev = 142),
                                                                        (_ctx.next = 145),
                                                                        _this.fetchComponent(
                                                                            "/404"
                                                                        )
                                                                    );
                                                                case 145:
                                                                    (notFoundRoute =
                                                                        "/404"),
                                                                        (_ctx.next = 151);
                                                                    break;
                                                                case 148:
                                                                    (_ctx.prev = 148),
                                                                        (_ctx.t5 =
                                                                            _ctx.catch(
                                                                                142
                                                                            )),
                                                                        (notFoundRoute =
                                                                            "/_error");
                                                                case 151:
                                                                    return (
                                                                        (_ctx.next = 153),
                                                                        _this.getRouteInfo(
                                                                            {
                                                                                route: notFoundRoute,
                                                                                pathname:
                                                                                    notFoundRoute,
                                                                                query: query,
                                                                                as: as,
                                                                                resolvedAs:
                                                                                    resolvedAs,
                                                                                routeProps:
                                                                                    {
                                                                                        shallow:
                                                                                            !1,
                                                                                    },
                                                                                locale: nextState.locale,
                                                                                isPreview:
                                                                                    nextState.isPreview,
                                                                            }
                                                                        )
                                                                    );
                                                                case 153:
                                                                    if (
                                                                        !(
                                                                            "type" in
                                                                            (routeInfo =
                                                                                _ctx.sent)
                                                                        )
                                                                    ) {
                                                                        _ctx.next = 156;
                                                                        break;
                                                                    }
                                                                    throw Error(
                                                                        "Unexpected middleware effect on /404"
                                                                    );
                                                                case 156:
                                                                    return (
                                                                        Router.events.emit(
                                                                            "beforeHistoryChange",
                                                                            as,
                                                                            routeProps
                                                                        ),
                                                                        _this.changeState(
                                                                            method,
                                                                            url,
                                                                            as,
                                                                            options
                                                                        ),
                                                                        isQueryUpdating &&
                                                                            "/_error" ===
                                                                                pathname &&
                                                                            (null ==
                                                                            (ref11 =
                                                                                self
                                                                                    .__NEXT_DATA__
                                                                                    .props)
                                                                                ? void 0
                                                                                : null ==
                                                                                  (ref21 =
                                                                                      ref11.pageProps)
                                                                                ? void 0
                                                                                : ref21.statusCode) ===
                                                                                500 &&
                                                                            (null ==
                                                                            props
                                                                                ? void 0
                                                                                : props.pageProps) &&
                                                                            (props.pageProps.statusCode = 500),
                                                                        (isValidShallowRoute =
                                                                            options.shallow &&
                                                                            nextState.route ===
                                                                                (null !=
                                                                                (_route =
                                                                                    routeInfo.route)
                                                                                    ? _route
                                                                                    : route)),
                                                                        (shouldScroll =
                                                                            null !=
                                                                            (_scroll1 =
                                                                                options.scroll)
                                                                                ? _scroll1
                                                                                : !isValidShallowRoute),
                                                                        (resetScroll =
                                                                            shouldScroll
                                                                                ? {
                                                                                      x: 0,
                                                                                      y: 0,
                                                                                  }
                                                                                : null),
                                                                        (_ctx.next = 166),
                                                                        _this
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
                                                                                        isFallback:
                                                                                            !1,
                                                                                    }
                                                                                ),
                                                                                routeInfo,
                                                                                null !=
                                                                                    forcedScroll
                                                                                    ? forcedScroll
                                                                                    : resetScroll
                                                                            )
                                                                            .catch(
                                                                                function (
                                                                                    e
                                                                                ) {
                                                                                    if (
                                                                                        e.cancelled
                                                                                    )
                                                                                        error =
                                                                                            error ||
                                                                                            e;
                                                                                    else
                                                                                        throw e;
                                                                                }
                                                                            )
                                                                    );
                                                                case 166:
                                                                    if (
                                                                        !error
                                                                    ) {
                                                                        _ctx.next = 169;
                                                                        break;
                                                                    }
                                                                    throw (
                                                                        (isQueryUpdating ||
                                                                            Router.events.emit(
                                                                                "routeChangeError",
                                                                                error,
                                                                                cleanedAs,
                                                                                routeProps
                                                                            ),
                                                                        error)
                                                                    );
                                                                case 169:
                                                                    return (
                                                                        isQueryUpdating ||
                                                                            Router.events.emit(
                                                                                "routeChangeComplete",
                                                                                as,
                                                                                routeProps
                                                                            ),
                                                                        (hashRegex =
                                                                            /#.+$/),
                                                                        shouldScroll &&
                                                                            hashRegex.test(
                                                                                as
                                                                            ) &&
                                                                            _this.scrollToHash(
                                                                                as
                                                                            ),
                                                                        _ctx.abrupt(
                                                                            "return",
                                                                            !0
                                                                        )
                                                                    );
                                                                case 176:
                                                                    if (
                                                                        ((_ctx.prev = 176),
                                                                        (_ctx.t6 =
                                                                            _ctx.catch(
                                                                                112
                                                                            )),
                                                                        !(
                                                                            _isError.default(
                                                                                _ctx.t6
                                                                            ) &&
                                                                            _ctx
                                                                                .t6
                                                                                .cancelled
                                                                        ))
                                                                    ) {
                                                                        _ctx.next = 180;
                                                                        break;
                                                                    }
                                                                    return _ctx.abrupt(
                                                                        "return",
                                                                        !1
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
                                            }
                                        )
                                    )();
                                },
                            },
                            {
                                key: "changeState",
                                value: function (method, url, as) {
                                    var options =
                                        arguments.length > 3 &&
                                        void 0 !== arguments[3]
                                            ? arguments[3]
                                            : {};
                                    ("pushState" !== method ||
                                        _utils.getURL() !== as) &&
                                        ((this._shallow = options.shallow),
                                        window.history[method](
                                            {
                                                url: url,
                                                as: as,
                                                options: options,
                                                __N: !0,
                                                key: (this._key =
                                                    "pushState" !== method
                                                        ? this._key
                                                        : createKey()),
                                            },
                                            "",
                                            as
                                        ));
                                },
                            },
                            {
                                key: "handleRouteInfoError",
                                value: function (
                                    err,
                                    pathname,
                                    query,
                                    as,
                                    routeProps,
                                    loadErrorFail
                                ) {
                                    var _this = this;
                                    return _async_to_generator(
                                        _runtimeJs.default.mark(
                                            function _callee() {
                                                var Component,
                                                    styleSheets,
                                                    props,
                                                    ref,
                                                    routeInfo;
                                                return _runtimeJs.default.wrap(
                                                    function (_ctx) {
                                                        for (;;)
                                                            switch (
                                                                (_ctx.prev =
                                                                    _ctx.next)
                                                            ) {
                                                                case 0:
                                                                    if (
                                                                        (console.error(
                                                                            err
                                                                        ),
                                                                        !err.cancelled)
                                                                    ) {
                                                                        _ctx.next = 3;
                                                                        break;
                                                                    }
                                                                    throw err;
                                                                case 3:
                                                                    if (
                                                                        !(
                                                                            _routeLoader.isAssetError(
                                                                                err
                                                                            ) ||
                                                                            loadErrorFail
                                                                        )
                                                                    ) {
                                                                        _ctx.next = 7;
                                                                        break;
                                                                    }
                                                                    throw (
                                                                        (Router.events.emit(
                                                                            "routeChangeError",
                                                                            err,
                                                                            as,
                                                                            routeProps
                                                                        ),
                                                                        handleHardNavigation(
                                                                            {
                                                                                url: as,
                                                                                router: _this,
                                                                            }
                                                                        ),
                                                                        buildCancellationError())
                                                                    );
                                                                case 7:
                                                                    if (
                                                                        ((_ctx.prev = 7),
                                                                        !(
                                                                            void 0 ===
                                                                                Component ||
                                                                            void 0 ===
                                                                                styleSheets
                                                                        ))
                                                                    ) {
                                                                        _ctx.next = 19;
                                                                        break;
                                                                    }
                                                                    return (
                                                                        (_ctx.next = 15),
                                                                        _this.fetchComponent(
                                                                            "/_error"
                                                                        )
                                                                    );
                                                                case 15:
                                                                    (Component =
                                                                        (ref =
                                                                            _ctx.sent)
                                                                            .page),
                                                                        (styleSheets =
                                                                            ref.styleSheets);
                                                                case 19:
                                                                    if (
                                                                        (routeInfo =
                                                                            {
                                                                                props: props,
                                                                                Component:
                                                                                    Component,
                                                                                styleSheets:
                                                                                    styleSheets,
                                                                                err: err,
                                                                                error: err,
                                                                            })
                                                                            .props
                                                                    ) {
                                                                        _ctx.next = 31;
                                                                        break;
                                                                    }
                                                                    return (
                                                                        (_ctx.prev = 21),
                                                                        (_ctx.next = 24),
                                                                        _this.getInitialProps(
                                                                            Component,
                                                                            {
                                                                                err: err,
                                                                                pathname:
                                                                                    pathname,
                                                                                query: query,
                                                                            }
                                                                        )
                                                                    );
                                                                case 24:
                                                                    (routeInfo.props =
                                                                        _ctx.sent),
                                                                        (_ctx.next = 31);
                                                                    break;
                                                                case 27:
                                                                    (_ctx.prev = 27),
                                                                        (_ctx.t0 =
                                                                            _ctx.catch(
                                                                                21
                                                                            )),
                                                                        console.error(
                                                                            "Error in error page `getInitialProps`: ",
                                                                            _ctx.t0
                                                                        ),
                                                                        (routeInfo.props =
                                                                            {});
                                                                case 31:
                                                                    return _ctx.abrupt(
                                                                        "return",
                                                                        routeInfo
                                                                    );
                                                                case 34:
                                                                    return (
                                                                        (_ctx.prev = 34),
                                                                        (_ctx.t1 =
                                                                            _ctx.catch(
                                                                                7
                                                                            )),
                                                                        _ctx.abrupt(
                                                                            "return",
                                                                            _this.handleRouteInfoError(
                                                                                _isError.default(
                                                                                    _ctx.t1
                                                                                )
                                                                                    ? _ctx.t1
                                                                                    : Error(
                                                                                          _ctx.t1 +
                                                                                              ""
                                                                                      ),
                                                                                pathname,
                                                                                query,
                                                                                as,
                                                                                routeProps,
                                                                                !0
                                                                            )
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
                                            }
                                        )
                                    )();
                                },
                            },
                            {
                                key: "getRouteInfo",
                                value: function (param) {
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
                                            param.unstable_skipClientCache,
                                        _this = this;
                                    return _async_to_generator(
                                        _runtimeJs.default.mark(
                                            function _callee() {
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
                                                    useStreamedFlightData,
                                                    shouldFetchData,
                                                    props,
                                                    cacheKey;
                                                return _runtimeJs.default.wrap(
                                                    function (_ctx) {
                                                        for (;;)
                                                            switch (
                                                                (_ctx.prev =
                                                                    _ctx.next)
                                                            ) {
                                                                case 0:
                                                                    if (
                                                                        ((route =
                                                                            requestedRoute),
                                                                        (_ctx.prev = 1),
                                                                        (handleCancelled =
                                                                            getCancelledHandler(
                                                                                {
                                                                                    route: route,
                                                                                    router: _this,
                                                                                }
                                                                            )),
                                                                        (existingInfo =
                                                                            _this
                                                                                .components[
                                                                                route
                                                                            ]),
                                                                        !(
                                                                            !hasMiddleware &&
                                                                            routeProps.shallow &&
                                                                            existingInfo &&
                                                                            _this.route ===
                                                                                route
                                                                        ))
                                                                    ) {
                                                                        _ctx.next = 7;
                                                                        break;
                                                                    }
                                                                    return _ctx.abrupt(
                                                                        "return",
                                                                        existingInfo
                                                                    );
                                                                case 7:
                                                                    return (
                                                                        (cachedRouteInfo =
                                                                            !existingInfo ||
                                                                            "initial" in
                                                                                existingInfo
                                                                                ? void 0
                                                                                : existingInfo),
                                                                        (fetchNextDataParams =
                                                                            {
                                                                                dataHref:
                                                                                    _this.pageLoader.getDataHref(
                                                                                        {
                                                                                            href: _formatUrl.formatWithValidation(
                                                                                                {
                                                                                                    pathname:
                                                                                                        pathname,
                                                                                                    query: query,
                                                                                                }
                                                                                            ),
                                                                                            skipInterpolation:
                                                                                                !0,
                                                                                            asPath: resolvedAs,
                                                                                            locale: locale,
                                                                                        }
                                                                                    ),
                                                                                hasMiddleware:
                                                                                    !0,
                                                                                isServerRender:
                                                                                    _this.isSsr,
                                                                                parseJSON:
                                                                                    !0,
                                                                                inflightCache:
                                                                                    _this.sdc,
                                                                                persistCache:
                                                                                    !isPreview,
                                                                                isPrefetch:
                                                                                    !1,
                                                                                unstable_skipClientCache:
                                                                                    unstable_skipClientCache,
                                                                            }),
                                                                        (_ctx.next = 11),
                                                                        withMiddlewareEffects(
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
                                                                        )
                                                                    );
                                                                case 11:
                                                                    if (
                                                                        ((data =
                                                                            _ctx.sent),
                                                                        handleCancelled(),
                                                                        !(
                                                                            (null ==
                                                                            data
                                                                                ? void 0
                                                                                : null ==
                                                                                  (ref =
                                                                                      data.effect)
                                                                                ? void 0
                                                                                : ref.type) ===
                                                                                "redirect-internal" ||
                                                                            (null ==
                                                                            data
                                                                                ? void 0
                                                                                : null ==
                                                                                  (ref3 =
                                                                                      data.effect)
                                                                                ? void 0
                                                                                : ref3.type) ===
                                                                                "redirect-external"
                                                                        ))
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
                                                                        (null ==
                                                                        data
                                                                            ? void 0
                                                                            : null ==
                                                                              (ref4 =
                                                                                  data.effect)
                                                                            ? void 0
                                                                            : ref4.type) !==
                                                                        "rewrite"
                                                                    ) {
                                                                        _ctx.next = 25;
                                                                        break;
                                                                    }
                                                                    if (
                                                                        ((route =
                                                                            _removeTrailingSlash.removeTrailingSlash(
                                                                                data
                                                                                    .effect
                                                                                    .resolvedHref
                                                                            )),
                                                                        (pathname =
                                                                            data
                                                                                .effect
                                                                                .resolvedHref),
                                                                        (query =
                                                                            _object_spread(
                                                                                {},
                                                                                query,
                                                                                data
                                                                                    .effect
                                                                                    .parsedAs
                                                                                    .query
                                                                            )),
                                                                        (resolvedAs =
                                                                            data
                                                                                .effect
                                                                                .parsedAs
                                                                                .pathname),
                                                                        (existingInfo =
                                                                            _this
                                                                                .components[
                                                                                route
                                                                            ]),
                                                                        !(
                                                                            routeProps.shallow &&
                                                                            existingInfo &&
                                                                            _this.route ===
                                                                                route &&
                                                                            !hasMiddleware
                                                                        ))
                                                                    ) {
                                                                        _ctx.next = 24;
                                                                        break;
                                                                    }
                                                                    return (
                                                                        (_this.components[
                                                                            requestedRoute
                                                                        ] = _object_spread_props(
                                                                            _object_spread(
                                                                                {},
                                                                                existingInfo
                                                                            ),
                                                                            {
                                                                                route: route,
                                                                            }
                                                                        )),
                                                                        _ctx.abrupt(
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
                                                                        )
                                                                    );
                                                                case 24:
                                                                    cachedRouteInfo =
                                                                        !existingInfo ||
                                                                        "initial" in
                                                                            existingInfo
                                                                            ? void 0
                                                                            : existingInfo;
                                                                case 25:
                                                                    if (
                                                                        !(
                                                                            "/api" ===
                                                                                route ||
                                                                            route.startsWith(
                                                                                "/api/"
                                                                            )
                                                                        )
                                                                    ) {
                                                                        _ctx.next = 28;
                                                                        break;
                                                                    }
                                                                    return (
                                                                        handleHardNavigation(
                                                                            {
                                                                                url: resolvedAs,
                                                                                router: _this,
                                                                            }
                                                                        ),
                                                                        _ctx.abrupt(
                                                                            "return",
                                                                            new Promise(
                                                                                function () {}
                                                                            )
                                                                        )
                                                                    );
                                                                case 28:
                                                                    if (
                                                                        ((_ctx.t0 =
                                                                            cachedRouteInfo),
                                                                        _ctx.t0)
                                                                    ) {
                                                                        _ctx.next = 33;
                                                                        break;
                                                                    }
                                                                    return (
                                                                        (_ctx.next = 32),
                                                                        _this
                                                                            .fetchComponent(
                                                                                route
                                                                            )
                                                                            .then(
                                                                                function (
                                                                                    res
                                                                                ) {
                                                                                    return {
                                                                                        Component:
                                                                                            res.page,
                                                                                        styleSheets:
                                                                                            res.styleSheets,
                                                                                        __N_SSG:
                                                                                            res
                                                                                                .mod
                                                                                                .__N_SSG,
                                                                                        __N_SSP:
                                                                                            res
                                                                                                .mod
                                                                                                .__N_SSP,
                                                                                        __N_RSC:
                                                                                            !!res
                                                                                                .mod
                                                                                                .__next_rsc__,
                                                                                    };
                                                                                }
                                                                            )
                                                                    );
                                                                case 32:
                                                                    _ctx.t0 =
                                                                        _ctx.sent;
                                                                case 33:
                                                                    (routeInfo =
                                                                        _ctx.t0),
                                                                        (_ctx.next = 38);
                                                                    break;
                                                                case 38:
                                                                    return (
                                                                        (useStreamedFlightData =
                                                                            routeInfo.__N_RSC &&
                                                                            routeInfo.__N_SSP),
                                                                        (shouldFetchData =
                                                                            routeInfo.__N_SSG ||
                                                                            routeInfo.__N_SSP ||
                                                                            routeInfo.__N_RSC),
                                                                        (_ctx.next = 42),
                                                                        _this._getData(
                                                                            _async_to_generator(
                                                                                _runtimeJs.default.mark(
                                                                                    function _callee() {
                                                                                        var json;
                                                                                        return _runtimeJs.default.wrap(
                                                                                            function (
                                                                                                _ctx
                                                                                            ) {
                                                                                                for (;;)
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
                                                                                                            if (
                                                                                                                ((_ctx.t0 =
                                                                                                                    data),
                                                                                                                _ctx.t0)
                                                                                                            ) {
                                                                                                                _ctx.next = 6;
                                                                                                                break;
                                                                                                            }
                                                                                                            return (
                                                                                                                (_ctx.next = 5),
                                                                                                                fetchNextData(
                                                                                                                    {
                                                                                                                        dataHref:
                                                                                                                            _this.pageLoader.getDataHref(
                                                                                                                                {
                                                                                                                                    href: _formatUrl.formatWithValidation(
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
                                                                                                                        parseJSON:
                                                                                                                            !0,
                                                                                                                        inflightCache:
                                                                                                                            _this.sdc,
                                                                                                                        persistCache:
                                                                                                                            !isPreview,
                                                                                                                        isPrefetch:
                                                                                                                            !1,
                                                                                                                        unstable_skipClientCache:
                                                                                                                            unstable_skipClientCache,
                                                                                                                    }
                                                                                                                )
                                                                                                            );
                                                                                                        case 5:
                                                                                                            _ctx.t0 =
                                                                                                                _ctx.sent;
                                                                                                        case 6:
                                                                                                            return (
                                                                                                                (json =
                                                                                                                    _ctx
                                                                                                                        .t0
                                                                                                                        .json),
                                                                                                                _ctx.abrupt(
                                                                                                                    "return",
                                                                                                                    {
                                                                                                                        props: json,
                                                                                                                    }
                                                                                                                )
                                                                                                            );
                                                                                                        case 8:
                                                                                                            return (
                                                                                                                (_ctx.t1 =
                                                                                                                    {}),
                                                                                                                (_ctx.next = 11),
                                                                                                                _this.getInitialProps(
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
                                                                                                                )
                                                                                                            );
                                                                                                        case 11:
                                                                                                            return (
                                                                                                                (_ctx.t2 =
                                                                                                                    _ctx.sent),
                                                                                                                _ctx.abrupt(
                                                                                                                    "return",
                                                                                                                    {
                                                                                                                        headers:
                                                                                                                            _ctx.t1,
                                                                                                                        props: _ctx.t2,
                                                                                                                    }
                                                                                                                )
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
                                                                        )
                                                                    );
                                                                case 42:
                                                                    if (
                                                                        ((props =
                                                                            _ctx
                                                                                .sent
                                                                                .props),
                                                                        routeInfo.__N_SSP &&
                                                                            fetchNextDataParams.dataHref &&
                                                                            ((cacheKey =
                                                                                new URL(
                                                                                    fetchNextDataParams.dataHref,
                                                                                    window.location.href
                                                                                )
                                                                                    .href),
                                                                            delete _this
                                                                                .sdc[
                                                                                cacheKey
                                                                            ]),
                                                                        !_this.isPreview &&
                                                                            routeInfo.__N_SSG &&
                                                                            fetchNextData(
                                                                                Object.assign(
                                                                                    {},
                                                                                    fetchNextDataParams,
                                                                                    {
                                                                                        isBackground:
                                                                                            !0,
                                                                                        persistCache:
                                                                                            !1,
                                                                                        inflightCache:
                                                                                            backgroundCache,
                                                                                    }
                                                                                )
                                                                            ).catch(
                                                                                function () {}
                                                                            ),
                                                                        !routeInfo.__N_RSC)
                                                                    ) {
                                                                        _ctx.next = 58;
                                                                        break;
                                                                    }
                                                                    if (
                                                                        ((_ctx.t1 =
                                                                            Object),
                                                                        (_ctx.t2 =
                                                                            props.pageProps),
                                                                        !useStreamedFlightData)
                                                                    ) {
                                                                        _ctx.next = 54;
                                                                        break;
                                                                    }
                                                                    return (
                                                                        (_ctx.next = 51),
                                                                        _this._getData(
                                                                            function () {
                                                                                return _this._getFlightData(
                                                                                    _formatUrl.formatWithValidation(
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
                                                                                                _isDynamic.isDynamicRoute(
                                                                                                    route
                                                                                                )
                                                                                                    ? interpolateAs(
                                                                                                          pathname,
                                                                                                          _parseRelativeUrl.parseRelativeUrl(
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
                                                                        )
                                                                    );
                                                                case 51:
                                                                    (_ctx.t3 =
                                                                        _ctx.sent.data),
                                                                        (_ctx.next = 55);
                                                                    break;
                                                                case 54:
                                                                    _ctx.t3 =
                                                                        props.__flight__;
                                                                case 55:
                                                                    (_ctx.t4 =
                                                                        _ctx.t3),
                                                                        (_ctx.t5 =
                                                                            {
                                                                                __flight__:
                                                                                    _ctx.t4,
                                                                            }),
                                                                        (props.pageProps =
                                                                            _ctx.t1.assign.call(
                                                                                _ctx.t1,
                                                                                _ctx.t2,
                                                                                _ctx.t5
                                                                            ));
                                                                case 58:
                                                                    return (
                                                                        (routeInfo.props =
                                                                            props),
                                                                        (routeInfo.route =
                                                                            route),
                                                                        (routeInfo.query =
                                                                            query),
                                                                        (routeInfo.resolvedAs =
                                                                            resolvedAs),
                                                                        (_this.components[
                                                                            route
                                                                        ] = routeInfo),
                                                                        route !==
                                                                            requestedRoute &&
                                                                            (_this.components[
                                                                                requestedRoute
                                                                            ] =
                                                                                _object_spread_props(
                                                                                    _object_spread(
                                                                                        {},
                                                                                        routeInfo
                                                                                    ),
                                                                                    {
                                                                                        route: route,
                                                                                    }
                                                                                )),
                                                                        _ctx.abrupt(
                                                                            "return",
                                                                            routeInfo
                                                                        )
                                                                    );
                                                                case 67:
                                                                    return (
                                                                        (_ctx.prev = 67),
                                                                        (_ctx.t6 =
                                                                            _ctx.catch(
                                                                                1
                                                                            )),
                                                                        _ctx.abrupt(
                                                                            "return",
                                                                            _this.handleRouteInfoError(
                                                                                _isError.getProperError(
                                                                                    _ctx.t6
                                                                                ),
                                                                                pathname,
                                                                                query,
                                                                                as,
                                                                                routeProps
                                                                            )
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
                                            }
                                        )
                                    )();
                                },
                            },
                            {
                                key: "set",
                                value: function (state, data, resetScroll) {
                                    return (
                                        (this.state = state),
                                        this.sub(
                                            data,
                                            this.components["/_app"].Component,
                                            resetScroll
                                        )
                                    );
                                },
                            },
                            {
                                key: "beforePopState",
                                value: function (cb) {
                                    this._bps = cb;
                                },
                            },
                            {
                                key: "onlyAHashChange",
                                value: function (as) {
                                    if (!this.asPath) return !1;
                                    var ref = _sliced_to_array(
                                            this.asPath.split("#"),
                                            2
                                        ),
                                        oldUrlNoHash = ref[0],
                                        oldHash = ref[1],
                                        ref1 = _sliced_to_array(
                                            as.split("#"),
                                            2
                                        ),
                                        newUrlNoHash = ref1[0],
                                        newHash = ref1[1];
                                    return (
                                        (!!newHash &&
                                            oldUrlNoHash === newUrlNoHash &&
                                            oldHash === newHash) ||
                                        (oldUrlNoHash === newUrlNoHash &&
                                            oldHash !== newHash)
                                    );
                                },
                            },
                            {
                                key: "scrollToHash",
                                value: function (as) {
                                    var ref = _sliced_to_array(
                                            as.split("#"),
                                            2
                                        ),
                                        tmp = ref[1],
                                        hash = void 0 === tmp ? "" : tmp;
                                    if ("" === hash || "top" === hash) {
                                        window.scrollTo(0, 0);
                                        return;
                                    }
                                    var rawHash = decodeURIComponent(hash),
                                        idEl = document.getElementById(rawHash);
                                    if (idEl) {
                                        idEl.scrollIntoView();
                                        return;
                                    }
                                    var nameEl =
                                        document.getElementsByName(rawHash)[0];
                                    nameEl && nameEl.scrollIntoView();
                                },
                            },
                            {
                                key: "urlIsNew",
                                value: function (asPath) {
                                    return this.asPath !== asPath;
                                },
                            },
                            {
                                key: "prefetch",
                                value: function (url) {
                                    var asPath =
                                            arguments.length > 1 &&
                                            void 0 !== arguments[1]
                                                ? arguments[1]
                                                : url,
                                        options =
                                            arguments.length > 2 &&
                                            void 0 !== arguments[2]
                                                ? arguments[2]
                                                : {},
                                        _this = this;
                                    return _async_to_generator(
                                        _runtimeJs.default.mark(
                                            function _callee() {
                                                var parsed,
                                                    pathname,
                                                    query,
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
                                                    function (_ctx) {
                                                        for (;;)
                                                            switch (
                                                                (_ctx.prev =
                                                                    _ctx.next)
                                                            ) {
                                                                case 0:
                                                                    return (
                                                                        (pathname =
                                                                            (parsed =
                                                                                _parseRelativeUrl.parseRelativeUrl(
                                                                                    url
                                                                                ))
                                                                                .pathname),
                                                                        (query =
                                                                            parsed.query),
                                                                        (_ctx.next = 5),
                                                                        _this.pageLoader.getPageList()
                                                                    );
                                                                case 5:
                                                                    return (
                                                                        (pages =
                                                                            _ctx.sent),
                                                                        (resolvedAs =
                                                                            asPath),
                                                                        (locale =
                                                                            void 0 !==
                                                                            options.locale
                                                                                ? options.locale ||
                                                                                  void 0
                                                                                : _this.locale),
                                                                        (_ctx.next = 10),
                                                                        matchesMiddleware(
                                                                            {
                                                                                asPath: asPath,
                                                                                locale: locale,
                                                                                router: _this,
                                                                            }
                                                                        )
                                                                    );
                                                                case 10:
                                                                    (isMiddlewareMatch =
                                                                        _ctx.sent),
                                                                        (_ctx.next = 24);
                                                                    break;
                                                                case 16:
                                                                    if (
                                                                        ((rewrites =
                                                                            (ref =
                                                                                _ctx.sent)
                                                                                .__rewrites),
                                                                        !(rewritesResult =
                                                                            _resolveRewrites.default(
                                                                                _addBasePath.addBasePath(
                                                                                    _addLocale.addLocale(
                                                                                        asPath,
                                                                                        _this.locale
                                                                                    ),
                                                                                    !0
                                                                                ),
                                                                                pages,
                                                                                rewrites,
                                                                                parsed.query,
                                                                                function (
                                                                                    p
                                                                                ) {
                                                                                    return resolveDynamicRoute(
                                                                                        p,
                                                                                        pages
                                                                                    );
                                                                                },
                                                                                _this.locales
                                                                            ))
                                                                            .externalDest)
                                                                    ) {
                                                                        _ctx.next = 22;
                                                                        break;
                                                                    }
                                                                    return _ctx.abrupt(
                                                                        "return"
                                                                    );
                                                                case 22:
                                                                    (resolvedAs =
                                                                        _removeLocale.removeLocale(
                                                                            _removeBasePath.removeBasePath(
                                                                                rewritesResult.asPath
                                                                            ),
                                                                            _this.locale
                                                                        )),
                                                                        rewritesResult.matchedPage &&
                                                                            rewritesResult.resolvedHref &&
                                                                            ((pathname =
                                                                                rewritesResult.resolvedHref),
                                                                            (parsed.pathname =
                                                                                pathname),
                                                                            isMiddlewareMatch ||
                                                                                (url =
                                                                                    _formatUrl.formatWithValidation(
                                                                                        parsed
                                                                                    )));
                                                                case 24:
                                                                    (parsed.pathname =
                                                                        resolveDynamicRoute(
                                                                            parsed.pathname,
                                                                            pages
                                                                        )),
                                                                        _isDynamic.isDynamicRoute(
                                                                            parsed.pathname
                                                                        ) &&
                                                                            ((pathname =
                                                                                parsed.pathname),
                                                                            (parsed.pathname =
                                                                                pathname),
                                                                            Object.assign(
                                                                                query,
                                                                                _routeMatcher.getRouteMatcher(
                                                                                    _routeRegex.getRouteRegex(
                                                                                        parsed.pathname
                                                                                    )
                                                                                )(
                                                                                    _parsePath.parsePath(
                                                                                        asPath
                                                                                    )
                                                                                        .pathname
                                                                                ) ||
                                                                                    {}
                                                                            ),
                                                                            isMiddlewareMatch ||
                                                                                (url =
                                                                                    _formatUrl.formatWithValidation(
                                                                                        parsed
                                                                                    ))),
                                                                        (_ctx.next = 28);
                                                                    break;
                                                                case 28:
                                                                    return (
                                                                        (_ctx.next = 30),
                                                                        withMiddlewareEffects(
                                                                            {
                                                                                fetchData:
                                                                                    function () {
                                                                                        return fetchNextData(
                                                                                            {
                                                                                                dataHref:
                                                                                                    _this.pageLoader.getDataHref(
                                                                                                        {
                                                                                                            href: _formatUrl.formatWithValidation(
                                                                                                                {
                                                                                                                    pathname:
                                                                                                                        pathname,
                                                                                                                    query: query,
                                                                                                                }
                                                                                                            ),
                                                                                                            skipInterpolation:
                                                                                                                !0,
                                                                                                            asPath: resolvedAs,
                                                                                                            locale: locale,
                                                                                                        }
                                                                                                    ),
                                                                                                hasMiddleware:
                                                                                                    !0,
                                                                                                isServerRender:
                                                                                                    _this.isSsr,
                                                                                                parseJSON:
                                                                                                    !0,
                                                                                                inflightCache:
                                                                                                    _this.sdc,
                                                                                                persistCache:
                                                                                                    !_this.isPreview,
                                                                                                isPrefetch:
                                                                                                    !0,
                                                                                            }
                                                                                        );
                                                                                    },
                                                                                asPath: asPath,
                                                                                locale: locale,
                                                                                router: _this,
                                                                            }
                                                                        )
                                                                    );
                                                                case 30:
                                                                    if (
                                                                        ((null ==
                                                                        (data =
                                                                            _ctx.sent)
                                                                            ? void 0
                                                                            : data
                                                                                  .effect
                                                                                  .type) ===
                                                                            "rewrite" &&
                                                                            ((parsed.pathname =
                                                                                data.effect.resolvedHref),
                                                                            (pathname =
                                                                                data
                                                                                    .effect
                                                                                    .resolvedHref),
                                                                            (query =
                                                                                _object_spread(
                                                                                    {},
                                                                                    query,
                                                                                    data
                                                                                        .effect
                                                                                        .parsedAs
                                                                                        .query
                                                                                )),
                                                                            (resolvedAs =
                                                                                data
                                                                                    .effect
                                                                                    .parsedAs
                                                                                    .pathname),
                                                                            (url =
                                                                                _formatUrl.formatWithValidation(
                                                                                    parsed
                                                                                ))),
                                                                        (null ==
                                                                        data
                                                                            ? void 0
                                                                            : data
                                                                                  .effect
                                                                                  .type) !==
                                                                            "redirect-external")
                                                                    ) {
                                                                        _ctx.next = 34;
                                                                        break;
                                                                    }
                                                                    return _ctx.abrupt(
                                                                        "return"
                                                                    );
                                                                case 34:
                                                                    return (
                                                                        (route =
                                                                            _removeTrailingSlash.removeTrailingSlash(
                                                                                pathname
                                                                            )),
                                                                        (_ctx.next = 37),
                                                                        Promise.all(
                                                                            [
                                                                                _this.pageLoader
                                                                                    ._isSsg(
                                                                                        route
                                                                                    )
                                                                                    .then(
                                                                                        function (
                                                                                            isSsg
                                                                                        ) {
                                                                                            return (
                                                                                                !!isSsg &&
                                                                                                fetchNextData(
                                                                                                    {
                                                                                                        dataHref:
                                                                                                            (null ==
                                                                                                            data
                                                                                                                ? void 0
                                                                                                                : data.dataHref) ||
                                                                                                            _this.pageLoader.getDataHref(
                                                                                                                {
                                                                                                                    href: url,
                                                                                                                    asPath: resolvedAs,
                                                                                                                    locale: locale,
                                                                                                                }
                                                                                                            ),
                                                                                                        isServerRender:
                                                                                                            !1,
                                                                                                        parseJSON:
                                                                                                            !0,
                                                                                                        inflightCache:
                                                                                                            _this.sdc,
                                                                                                        persistCache:
                                                                                                            !_this.isPreview,
                                                                                                        isPrefetch:
                                                                                                            !0,
                                                                                                        unstable_skipClientCache:
                                                                                                            options.unstable_skipClientCache ||
                                                                                                            options.priority,
                                                                                                    }
                                                                                                ).then(
                                                                                                    function () {
                                                                                                        return !1;
                                                                                                    }
                                                                                                )
                                                                                            );
                                                                                        }
                                                                                    ),
                                                                                _this.pageLoader[
                                                                                    options.priority
                                                                                        ? "loadPage"
                                                                                        : "prefetch"
                                                                                ](
                                                                                    route
                                                                                ),
                                                                            ]
                                                                        )
                                                                    );
                                                                case 37:
                                                                case "end":
                                                                    return _ctx.stop();
                                                            }
                                                    },
                                                    _callee
                                                );
                                            }
                                        )
                                    )();
                                },
                            },
                            {
                                key: "fetchComponent",
                                value: function (route) {
                                    var _this = this;
                                    return _async_to_generator(
                                        _runtimeJs.default.mark(
                                            function _callee() {
                                                var handleCancelled,
                                                    componentResult;
                                                return _runtimeJs.default.wrap(
                                                    function (_ctx) {
                                                        for (;;)
                                                            switch (
                                                                (_ctx.prev =
                                                                    _ctx.next)
                                                            ) {
                                                                case 0:
                                                                    return (
                                                                        (handleCancelled =
                                                                            getCancelledHandler(
                                                                                {
                                                                                    route: route,
                                                                                    router: _this,
                                                                                }
                                                                            )),
                                                                        (_ctx.prev = 1),
                                                                        (_ctx.next = 4),
                                                                        _this.pageLoader.loadPage(
                                                                            route
                                                                        )
                                                                    );
                                                                case 4:
                                                                    return (
                                                                        (componentResult =
                                                                            _ctx.sent),
                                                                        handleCancelled(),
                                                                        _ctx.abrupt(
                                                                            "return",
                                                                            componentResult
                                                                        )
                                                                    );
                                                                case 9:
                                                                    throw (
                                                                        ((_ctx.prev = 9),
                                                                        (_ctx.t0 =
                                                                            _ctx.catch(
                                                                                1
                                                                            )),
                                                                        handleCancelled(),
                                                                        _ctx.t0)
                                                                    );
                                                                case 13:
                                                                case "end":
                                                                    return _ctx.stop();
                                                            }
                                                    },
                                                    _callee,
                                                    null,
                                                    [[1, 9]]
                                                );
                                            }
                                        )
                                    )();
                                },
                            },
                            {
                                key: "_getData",
                                value: function (fn) {
                                    var _this = this,
                                        cancelled = !1,
                                        cancel = function () {
                                            cancelled = !0;
                                        };
                                    return (
                                        (this.clc = cancel),
                                        fn().then(function (data) {
                                            if (
                                                (cancel === _this.clc &&
                                                    (_this.clc = null),
                                                cancelled)
                                            ) {
                                                var err = Error(
                                                    "Loading initial props cancelled"
                                                );
                                                throw (
                                                    ((err.cancelled = !0), err)
                                                );
                                            }
                                            return data;
                                        })
                                    );
                                },
                            },
                            {
                                key: "_getFlightData",
                                value: function (dataHref) {
                                    return fetchNextData({
                                        dataHref: dataHref,
                                        isServerRender: !0,
                                        parseJSON: !1,
                                        inflightCache: this.sdc,
                                        persistCache: !1,
                                        isPrefetch: !1,
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
                                value: function (Component, ctx) {
                                    var ref = this.components["/_app"],
                                        App = ref.Component,
                                        AppTree = this._wrapApp(App);
                                    return (
                                        (ctx.AppTree = AppTree),
                                        _utils.loadGetInitialProps(App, {
                                            AppTree: AppTree,
                                            Component: Component,
                                            router: this,
                                            ctx: ctx,
                                        })
                                    );
                                },
                            },
                            {
                                key: "route",
                                get: function () {
                                    return this.state.route;
                                },
                            },
                            {
                                key: "pathname",
                                get: function () {
                                    return this.state.pathname;
                                },
                            },
                            {
                                key: "query",
                                get: function () {
                                    return this.state.query;
                                },
                            },
                            {
                                key: "asPath",
                                get: function () {
                                    return this.state.asPath;
                                },
                            },
                            {
                                key: "locale",
                                get: function () {
                                    return this.state.locale;
                                },
                            },
                            {
                                key: "isFallback",
                                get: function () {
                                    return this.state.isFallback;
                                },
                            },
                            {
                                key: "isPreview",
                                get: function () {
                                    return this.state.isPreview;
                                },
                            },
                        ]),
                        Router
                    );
                })();
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }
            function _getRequireWildcardCache() {
                if ("function" != typeof WeakMap) return null;
                var cache = new WeakMap();
                return (
                    (_getRequireWildcardCache = function () {
                        return cache;
                    }),
                    cache
                );
            }
            function buildCancellationError() {
                return Object.assign(Error("Route Cancelled"), {
                    cancelled: !0,
                });
            }
            function isLocalURL(url) {
                if (!_utils.isAbsoluteUrl(url)) return !0;
                try {
                    var locationOrigin = _utils.getLocationOrigin(),
                        resolved = new URL(url, locationOrigin);
                    return (
                        resolved.origin === locationOrigin &&
                        _hasBasePath.hasBasePath(resolved.pathname)
                    );
                } catch (_) {
                    return !1;
                }
            }
            function interpolateAs(route, asPathname, query) {
                var interpolatedRoute = "",
                    dynamicRegex = _routeRegex.getRouteRegex(route),
                    dynamicGroups = dynamicRegex.groups,
                    dynamicMatches =
                        (asPathname !== route
                            ? _routeMatcher.getRouteMatcher(dynamicRegex)(
                                  asPathname
                              )
                            : "") || query;
                interpolatedRoute = route;
                var params = Object.keys(dynamicGroups);
                return (
                    params.every(function (param) {
                        var value = dynamicMatches[param] || "",
                            _param = dynamicGroups[param],
                            repeat = _param.repeat,
                            optional = _param.optional,
                            replaced = "["
                                .concat(repeat ? "..." : "")
                                .concat(param, "]");
                        return (
                            optional &&
                                (replaced = ""
                                    .concat(value ? "" : "/", "[")
                                    .concat(replaced, "]")),
                            repeat &&
                                !Array.isArray(value) &&
                                (value = [value]),
                            (optional || param in dynamicMatches) &&
                                (interpolatedRoute =
                                    interpolatedRoute.replace(
                                        replaced,
                                        repeat
                                            ? value
                                                  .map(function (segment) {
                                                      return encodeURIComponent(
                                                          segment
                                                      );
                                                  })
                                                  .join("/")
                                            : encodeURIComponent(value)
                                    ) || "/")
                        );
                    }) || (interpolatedRoute = ""),
                    {
                        params: params,
                        result: interpolatedRoute,
                    }
                );
            }
            function omit(object, keys) {
                var omitted = {};
                return (
                    Object.keys(object).forEach(function (key) {
                        keys.includes(key) || (omitted[key] = object[key]);
                    }),
                    omitted
                );
            }
            function resolveHref(router, href, resolveAs) {
                var base,
                    urlAsString =
                        "string" == typeof href
                            ? href
                            : _formatUrl.formatWithValidation(href),
                    urlProtoMatch = urlAsString.match(/^[a-zA-Z]{1,}:\/\//),
                    urlAsStringNoProto = urlProtoMatch
                        ? urlAsString.slice(urlProtoMatch[0].length)
                        : urlAsString,
                    urlParts = urlAsStringNoProto.split("?");
                if ((urlParts[0] || "").match(/(\/\/|\\)/)) {
                    console.error(
                        "Invalid href passed to next/router: ".concat(
                            urlAsString,
                            ", repeated forward-slashes (//) or backslashes \\ are not valid in the href"
                        )
                    );
                    var normalizedUrl =
                        _utils.normalizeRepeatedSlashes(urlAsStringNoProto);
                    urlAsString =
                        (urlProtoMatch ? urlProtoMatch[0] : "") + normalizedUrl;
                }
                if (!isLocalURL(urlAsString))
                    return resolveAs ? [urlAsString] : urlAsString;
                try {
                    base = new URL(
                        urlAsString.startsWith("#")
                            ? router.asPath
                            : router.pathname,
                        "http://n"
                    );
                } catch (_) {
                    base = new URL("/", "http://n");
                }
                try {
                    var finalUrl = new URL(urlAsString, base);
                    finalUrl.pathname =
                        _normalizeTrailingSlash.normalizePathTrailingSlash(
                            finalUrl.pathname
                        );
                    var interpolatedAs = "";
                    if (
                        _isDynamic.isDynamicRoute(finalUrl.pathname) &&
                        finalUrl.searchParams &&
                        resolveAs
                    ) {
                        var query = _querystring.searchParamsToUrlQuery(
                                finalUrl.searchParams
                            ),
                            ref = interpolateAs(
                                finalUrl.pathname,
                                finalUrl.pathname,
                                query
                            ),
                            result = ref.result,
                            params = ref.params;
                        result &&
                            (interpolatedAs = _formatUrl.formatWithValidation({
                                pathname: result,
                                hash: finalUrl.hash,
                                query: omit(query, params),
                            }));
                    }
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
                var origin = _utils.getLocationOrigin();
                return url.startsWith(origin)
                    ? url.substring(origin.length)
                    : url;
            }
            function prepareUrlAs(router, url, as) {
                var ref = _sliced_to_array(resolveHref(router, url, !0), 2),
                    resolvedHref = ref[0],
                    resolvedAs = ref[1],
                    origin = _utils.getLocationOrigin(),
                    hrefHadOrigin = resolvedHref.startsWith(origin),
                    asHadOrigin = resolvedAs && resolvedAs.startsWith(origin);
                (resolvedHref = stripOrigin(resolvedHref)),
                    (resolvedAs = resolvedAs
                        ? stripOrigin(resolvedAs)
                        : resolvedAs);
                var preparedUrl = hrefHadOrigin
                        ? resolvedHref
                        : _addBasePath.addBasePath(resolvedHref),
                    preparedAs = as
                        ? stripOrigin(resolveHref(router, as))
                        : resolvedAs || resolvedHref;
                return {
                    url: preparedUrl,
                    as: asHadOrigin
                        ? preparedAs
                        : _addBasePath.addBasePath(preparedAs),
                };
            }
            function resolveDynamicRoute(pathname, pages) {
                var cleanPathname = _removeTrailingSlash.removeTrailingSlash(
                    _denormalizePagePath.denormalizePagePath(pathname)
                );
                return "/404" === cleanPathname || "/_error" === cleanPathname
                    ? pathname
                    : (pages.includes(cleanPathname) ||
                          pages.some(function (page) {
                              if (
                                  _isDynamic.isDynamicRoute(page) &&
                                  _routeRegex
                                      .getRouteRegex(page)
                                      .re.test(cleanPathname)
                              )
                                  return (pathname = page), !0;
                          }),
                      _removeTrailingSlash.removeTrailingSlash(pathname));
            }
            _define_property(Router, "events", _mitt.default()),
                (exports.default = Router);
            var SSG_DATA_NOT_FOUND = Symbol("SSG_DATA_NOT_FOUND");
            function fetchRetry(url, attempts, options) {
                return fetch(url, {
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
                    unstable_skipClientCache = param.unstable_skipClientCache,
                    ref = new URL(dataHref, window.location.href),
                    cacheKey = ref.href,
                    ref5,
                    getData = function (params) {
                        return fetchRetry(dataHref, isServerRender ? 3 : 1, {
                            headers: isPrefetch
                                ? {
                                      purpose: "prefetch",
                                  }
                                : {},
                            method:
                                null !=
                                (ref5 = null == params ? void 0 : params.method)
                                    ? ref5
                                    : "GET",
                        })
                            .then(function (response) {
                                return response.ok &&
                                    (null == params
                                        ? void 0
                                        : params.method) === "HEAD"
                                    ? {
                                          dataHref: dataHref,
                                          response: response,
                                          text: "",
                                          json: {},
                                      }
                                    : response.text().then(function (text) {
                                          if (!response.ok) {
                                              if (
                                                  hasMiddleware &&
                                                  [301, 302, 307, 308].includes(
                                                      response.status
                                                  )
                                              )
                                                  return {
                                                      dataHref: dataHref,
                                                      response: response,
                                                      text: text,
                                                      json: {},
                                                  };
                                              if (404 === response.status) {
                                                  var ref;
                                                  if (
                                                      null ==
                                                      (ref =
                                                          tryToParseAsJSON(
                                                              text
                                                          ))
                                                          ? void 0
                                                          : ref.notFound
                                                  )
                                                      return {
                                                          dataHref: dataHref,
                                                          json: {
                                                              notFound:
                                                                  SSG_DATA_NOT_FOUND,
                                                          },
                                                          response: response,
                                                          text: text,
                                                      };
                                                  if (hasMiddleware)
                                                      return {
                                                          dataHref: dataHref,
                                                          response: response,
                                                          text: text,
                                                          json: {},
                                                      };
                                              }
                                              var error = Error(
                                                  "Failed to load static props"
                                              );
                                              throw (
                                                  (isServerRender ||
                                                      _routeLoader.markAssetError(
                                                          error
                                                      ),
                                                  error)
                                              );
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
                                return (
                                    (persistCache &&
                                        "no-cache" !==
                                            data.response.headers.get(
                                                "x-middleware-cache"
                                            )) ||
                                        delete inflightCache[cacheKey],
                                    data
                                );
                            })
                            .catch(function (err) {
                                throw (delete inflightCache[cacheKey], err);
                            });
                    };
                return unstable_skipClientCache && persistCache
                    ? getData({}).then(function (data) {
                          return (
                              (inflightCache[cacheKey] = Promise.resolve(data)),
                              data
                          );
                      })
                    : void 0 !== inflightCache[cacheKey]
                    ? inflightCache[cacheKey]
                    : (inflightCache[cacheKey] = getData(
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
                if (
                    url ===
                    _addBasePath.addBasePath(
                        _addLocale.addLocale(router.asPath, router.locale)
                    )
                )
                    throw Error(
                        "Invariant: attempted to hard navigate to the same URL "
                            .concat(url, " ")
                            .concat(location.href)
                    );
                window.location.href = url;
            }
            var getCancelledHandler = function (param) {
                var route = param.route,
                    router = param.router,
                    cancelled = !1,
                    cancel = (router.clc = function () {
                        cancelled = !0;
                    });
                return function () {
                    if (cancelled) {
                        var error = Error(
                            'Abort fetching component for route: "'.concat(
                                route,
                                '"'
                            )
                        );
                        throw ((error.cancelled = !0), error);
                    }
                    cancel === router.clc && (router.clc = null);
                };
            };
            function matchesMiddleware(options) {
                return Promise.resolve(
                    options.router.pageLoader.getMiddlewareList()
                ).then(function (items) {
                    var ref = _parsePath.parsePath(options.asPath),
                        asPathname = ref.pathname,
                        cleanedAs = _hasBasePath.hasBasePath(asPathname)
                            ? _removeBasePath.removeBasePath(asPathname)
                            : asPathname;
                    return !!(null == items
                        ? void 0
                        : items.some(function (param) {
                              var _param = _sliced_to_array(param, 2),
                                  regex = _param[0],
                                  ssr = _param[1];
                              return (
                                  !ssr &&
                                  RegExp(regex).test(
                                      _addLocale.addLocale(
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
                    return matches && options.fetchData
                        ? options
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
                                  return null;
                              })
                        : null;
                });
            }
            function getMiddlewareData(source, response, options) {
                var nextConfig = {
                        basePath: options.router.basePath,
                        i18n: {
                            locales: options.router.locales,
                        },
                        trailingSlash: Boolean(!1),
                    },
                    rewriteHeader = response.headers.get("x-nextjs-rewrite"),
                    rewriteTarget =
                        rewriteHeader ||
                        response.headers.get("x-nextjs-matched-path"),
                    matchedPath = response.headers.get("x-matched-path");
                if (
                    (rewriteTarget ||
                        (null == matchedPath
                            ? void 0
                            : matchedPath.includes("__next_data_catchall")) ||
                        (rewriteTarget = matchedPath),
                    rewriteTarget)
                ) {
                    if (rewriteTarget.startsWith("/")) {
                        var parsedRewriteTarget =
                                _parseRelativeUrl.parseRelativeUrl(
                                    rewriteTarget
                                ),
                            pathnameInfo =
                                _getNextPathnameInfo.getNextPathnameInfo(
                                    parsedRewriteTarget.pathname,
                                    {
                                        nextConfig: nextConfig,
                                        parseData: !0,
                                    }
                                ),
                            fsPathname =
                                _removeTrailingSlash.removeTrailingSlash(
                                    pathnameInfo.pathname
                                );
                        return Promise.all([
                            options.router.pageLoader.getPageList(),
                            _routeLoader.getClientBuildManifest(),
                        ]).then(function (param) {
                            var _param = _sliced_to_array(param, 2),
                                pages = _param[0],
                                ref = _param[1];
                            ref.__rewrites;
                            var as = _addLocale.addLocale(
                                pathnameInfo.pathname,
                                pathnameInfo.locale
                            );
                            if (
                                _isDynamic.isDynamicRoute(as) ||
                                (!rewriteHeader &&
                                    pages.includes(
                                        _normalizeLocalePath.normalizeLocalePath(
                                            _removeBasePath.removeBasePath(as),
                                            options.router.locales
                                        ).pathname
                                    ))
                            ) {
                                var parsedSource =
                                    _getNextPathnameInfo.getNextPathnameInfo(
                                        _parseRelativeUrl.parseRelativeUrl(
                                            source
                                        ).pathname,
                                        {
                                            parseData: !0,
                                        }
                                    );
                                (as = _addBasePath.addBasePath(
                                    parsedSource.pathname
                                )),
                                    (parsedRewriteTarget.pathname = as);
                            }
                            var resolvedHref = pages.includes(fsPathname)
                                ? fsPathname
                                : resolveDynamicRoute(
                                      _normalizeLocalePath.normalizeLocalePath(
                                          _removeBasePath.removeBasePath(
                                              parsedRewriteTarget.pathname
                                          ),
                                          options.router.locales
                                      ).pathname,
                                      pages
                                  );
                            if (_isDynamic.isDynamicRoute(resolvedHref)) {
                                var matches = _routeMatcher.getRouteMatcher(
                                    _routeRegex.getRouteRegex(resolvedHref)
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
                    var src = _parsePath.parsePath(source),
                        pathname =
                            _formatNextPathnameInfo.formatNextPathnameInfo(
                                _object_spread_props(
                                    _object_spread(
                                        {},
                                        _getNextPathnameInfo.getNextPathnameInfo(
                                            src.pathname,
                                            {
                                                nextConfig: nextConfig,
                                                parseData: !0,
                                            }
                                        )
                                    ),
                                    {
                                        defaultLocale:
                                            options.router.defaultLocale,
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
                        var src1 = _parsePath.parsePath(redirectTarget),
                            pathname1 =
                                _formatNextPathnameInfo.formatNextPathnameInfo(
                                    _object_spread_props(
                                        _object_spread(
                                            {},
                                            _getNextPathnameInfo.getNextPathnameInfo(
                                                src1.pathname,
                                                {
                                                    nextConfig: nextConfig,
                                                    parseData: !0,
                                                }
                                            )
                                        ),
                                        {
                                            defaultLocale:
                                                options.router.defaultLocale,
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
            }
        },
        7459: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.addLocale = function (
                    path,
                    locale,
                    defaultLocale,
                    ignorePrefix
                ) {
                    return locale &&
                        locale !== defaultLocale &&
                        (ignorePrefix ||
                            (!_pathHasPrefix.pathHasPrefix(
                                path.toLowerCase(),
                                "/".concat(locale.toLowerCase())
                            ) &&
                                !_pathHasPrefix.pathHasPrefix(
                                    path.toLowerCase(),
                                    "/api"
                                )))
                        ? _addPathPrefix.addPathPrefix(path, "/".concat(locale))
                        : path;
                });
            var _addPathPrefix = __webpack_require__(5391),
                _pathHasPrefix = __webpack_require__(1259);
        },
        5391: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.addPathPrefix = function (path, prefix) {
                    if (!path.startsWith("/") || !prefix) return path;
                    var ref = _parsePath.parsePath(path),
                        pathname = ref.pathname,
                        query = ref.query,
                        hash = ref.hash;
                    return ""
                        .concat(prefix)
                        .concat(pathname)
                        .concat(query)
                        .concat(hash);
                });
            var _parsePath = __webpack_require__(4943);
        },
        4156: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.addPathSuffix = function (path, suffix) {
                    if (!path.startsWith("/") || !suffix) return path;
                    var ref = _parsePath.parsePath(path),
                        pathname = ref.pathname,
                        query = ref.query,
                        hash = ref.hash;
                    return ""
                        .concat(pathname)
                        .concat(suffix)
                        .concat(query)
                        .concat(hash);
                });
            var _parsePath = __webpack_require__(4943);
        },
        4022: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.formatNextPathnameInfo = function (info) {
                    var pathname = _addLocale.addLocale(
                        info.pathname,
                        info.locale,
                        info.buildId ? void 0 : info.defaultLocale,
                        info.ignorePrefix
                    );
                    return (
                        info.buildId &&
                            (pathname = _addPathSuffix.addPathSuffix(
                                _addPathPrefix.addPathPrefix(
                                    pathname,
                                    "/_next/data/".concat(info.buildId)
                                ),
                                "/" === info.pathname ? "index.json" : ".json"
                            )),
                        (pathname = _addPathPrefix.addPathPrefix(
                            pathname,
                            info.basePath
                        )),
                        info.trailingSlash
                            ? info.buildId || pathname.endsWith("/")
                                ? pathname
                                : _addPathSuffix.addPathSuffix(pathname, "/")
                            : _removeTrailingSlash.removeTrailingSlash(pathname)
                    );
                });
            var _removeTrailingSlash = __webpack_require__(6316),
                _addPathPrefix = __webpack_require__(5391),
                _addPathSuffix = __webpack_require__(4156),
                _addLocale = __webpack_require__(7459);
        },
        4611: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.formatUrl = formatUrl),
                (exports.formatWithValidation = function (url) {
                    return formatUrl(url);
                }),
                (exports.urlObjectKeys = void 0);
            var querystring = (function (obj) {
                if (obj && obj.__esModule) return obj;
                if (
                    null === obj ||
                    ("object" != typeof obj && "function" != typeof obj)
                )
                    return {
                        default: obj,
                    };
                var cache = _getRequireWildcardCache();
                if (cache && cache.has(obj)) return cache.get(obj);
                var newObj = {},
                    hasPropertyDescriptor =
                        Object.defineProperty &&
                        Object.getOwnPropertyDescriptor;
                for (var key in obj)
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        var desc = hasPropertyDescriptor
                            ? Object.getOwnPropertyDescriptor(obj, key)
                            : null;
                        desc && (desc.get || desc.set)
                            ? Object.defineProperty(newObj, key, desc)
                            : (newObj[key] = obj[key]);
                    }
                return (
                    (newObj.default = obj),
                    cache && cache.set(obj, newObj),
                    newObj
                );
            })(__webpack_require__(466));
            function _getRequireWildcardCache() {
                if ("function" != typeof WeakMap) return null;
                var cache = new WeakMap();
                return (
                    (_getRequireWildcardCache = function () {
                        return cache;
                    }),
                    cache
                );
            }
            var slashedProtocols = /https?|ftp|gopher|file/;
            function formatUrl(urlObj) {
                var auth = urlObj.auth,
                    hostname = urlObj.hostname,
                    protocol = urlObj.protocol || "",
                    pathname = urlObj.pathname || "",
                    hash = urlObj.hash || "",
                    query = urlObj.query || "",
                    host = !1;
                (auth = auth
                    ? encodeURIComponent(auth).replace(/%3A/i, ":") + "@"
                    : ""),
                    urlObj.host
                        ? (host = auth + urlObj.host)
                        : hostname &&
                          ((host =
                              auth +
                              (~hostname.indexOf(":")
                                  ? "[".concat(hostname, "]")
                                  : hostname)),
                          urlObj.port && (host += ":" + urlObj.port)),
                    query &&
                        "object" == typeof query &&
                        (query = String(
                            querystring.urlQueryToSearchParams(query)
                        ));
                var search =
                    urlObj.search || (query && "?".concat(query)) || "";
                return (
                    protocol && !protocol.endsWith(":") && (protocol += ":"),
                    urlObj.slashes ||
                    ((!protocol || slashedProtocols.test(protocol)) &&
                        !1 !== host)
                        ? ((host = "//" + (host || "")),
                          pathname &&
                              "/" !== pathname[0] &&
                              (pathname = "/" + pathname))
                        : host || (host = ""),
                    hash && "#" !== hash[0] && (hash = "#" + hash),
                    search && "?" !== search[0] && (search = "?" + search),
                    (pathname = pathname.replace(/[?#]/g, encodeURIComponent)),
                    (search = search.replace("#", "%23")),
                    ""
                        .concat(protocol)
                        .concat(host)
                        .concat(pathname)
                        .concat(search)
                        .concat(hash)
                );
            }
            exports.urlObjectKeys = [
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
        },
        3891: function (__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function (route) {
                    var ext =
                            arguments.length > 1 && void 0 !== arguments[1]
                                ? arguments[1]
                                : "",
                        path =
                            "/" === route
                                ? "/index"
                                : /^\/index(\/|$)/.test(route)
                                ? "/index".concat(route)
                                : "".concat(route);
                    return path + ext;
                });
        },
        159: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.getNextPathnameInfo = function (pathname, options) {
                    var _nextConfig,
                        ref =
                            null != (_nextConfig = options.nextConfig)
                                ? _nextConfig
                                : {},
                        basePath = ref.basePath,
                        i18n = ref.i18n,
                        trailingSlash = ref.trailingSlash,
                        info = {
                            pathname: pathname,
                            trailingSlash:
                                "/" !== pathname
                                    ? pathname.endsWith("/")
                                    : trailingSlash,
                        };
                    if (
                        (basePath &&
                            _pathHasPrefix.pathHasPrefix(
                                info.pathname,
                                basePath
                            ) &&
                            ((info.pathname =
                                _removePathPrefix.removePathPrefix(
                                    info.pathname,
                                    basePath
                                )),
                            (info.basePath = basePath)),
                        !0 === options.parseData &&
                            info.pathname.startsWith("/_next/data/") &&
                            info.pathname.endsWith(".json"))
                    ) {
                        var paths = info.pathname
                                .replace(/^\/_next\/data\//, "")
                                .replace(/\.json$/, "")
                                .split("/"),
                            buildId = paths[0];
                        (info.pathname =
                            "index" !== paths[1]
                                ? "/".concat(paths.slice(1).join("/"))
                                : "/"),
                            (info.buildId = buildId);
                    }
                    if (i18n) {
                        var pathLocale =
                            _normalizeLocalePath.normalizeLocalePath(
                                info.pathname,
                                i18n.locales
                            );
                        (info.locale =
                            null == pathLocale
                                ? void 0
                                : pathLocale.detectedLocale),
                            (info.pathname =
                                (null == pathLocale
                                    ? void 0
                                    : pathLocale.pathname) || info.pathname);
                    }
                    return info;
                });
            var _normalizeLocalePath = __webpack_require__(4317),
                _removePathPrefix = __webpack_require__(9244),
                _pathHasPrefix = __webpack_require__(1259);
        },
        418: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                Object.defineProperty(exports, "getSortedRoutes", {
                    enumerable: !0,
                    get: function () {
                        return _sortedRoutes.getSortedRoutes;
                    },
                }),
                Object.defineProperty(exports, "isDynamicRoute", {
                    enumerable: !0,
                    get: function () {
                        return _isDynamic.isDynamicRoute;
                    },
                });
            var _sortedRoutes = __webpack_require__(3907),
                _isDynamic = __webpack_require__(8689);
        },
        8689: function (__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.isDynamicRoute = function (route) {
                    return TEST_ROUTE.test(route);
                });
            var TEST_ROUTE = /\/\[[^/]+?\](?=\/|$)/;
        },
        4943: function (__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.parsePath = function (path) {
                    var hashIndex = path.indexOf("#"),
                        queryIndex = path.indexOf("?");
                    return queryIndex > -1 || hashIndex > -1
                        ? {
                              pathname: path.substring(
                                  0,
                                  queryIndex > -1 ? queryIndex : hashIndex
                              ),
                              query:
                                  queryIndex > -1
                                      ? path.substring(
                                            queryIndex,
                                            hashIndex > -1 ? hashIndex : void 0
                                        )
                                      : "",
                              hash: hashIndex > -1 ? path.slice(hashIndex) : "",
                          }
                        : {
                              pathname: path,
                              query: "",
                              hash: "",
                          };
                });
        },
        6305: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.parseRelativeUrl = function (url, base) {
                    var globalBase = new URL(_utils.getLocationOrigin()),
                        resolvedBase = base
                            ? new URL(base, globalBase)
                            : url.startsWith(".")
                            ? new URL(window.location.href)
                            : globalBase,
                        ref = new URL(url, resolvedBase),
                        pathname = ref.pathname,
                        searchParams = ref.searchParams,
                        search = ref.search,
                        hash = ref.hash,
                        href = ref.href,
                        origin = ref.origin;
                    if (origin !== globalBase.origin)
                        throw Error(
                            "invariant: invalid relative URL, router received ".concat(
                                url
                            )
                        );
                    return {
                        pathname: pathname,
                        query: _querystring.searchParamsToUrlQuery(
                            searchParams
                        ),
                        search: search,
                        hash: hash,
                        href: href.slice(globalBase.origin.length),
                    };
                });
            var _utils = __webpack_require__(3794),
                _querystring = __webpack_require__(466);
        },
        1259: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.pathHasPrefix = function (path, prefix) {
                    if ("string" != typeof path) return !1;
                    var pathname = _parsePath.parsePath(path).pathname;
                    return (
                        pathname === prefix || pathname.startsWith(prefix + "/")
                    );
                });
            var _parsePath = __webpack_require__(4943);
        },
        466: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var _sliced_to_array = __webpack_require__(4941).Z;
            function stringifyUrlQueryParam(param) {
                return "string" != typeof param &&
                    ("number" != typeof param || isNaN(param)) &&
                    "boolean" != typeof param
                    ? ""
                    : String(param);
            }
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.searchParamsToUrlQuery = function (searchParams) {
                    var query = {};
                    return (
                        searchParams.forEach(function (value, key) {
                            void 0 === query[key]
                                ? (query[key] = value)
                                : Array.isArray(query[key])
                                ? query[key].push(value)
                                : (query[key] = [query[key], value]);
                        }),
                        query
                    );
                }),
                (exports.urlQueryToSearchParams = function (urlQuery) {
                    var result = new URLSearchParams();
                    return (
                        Object.entries(urlQuery).forEach(function (param) {
                            var _param = _sliced_to_array(param, 2),
                                key = _param[0],
                                value = _param[1];
                            Array.isArray(value)
                                ? value.forEach(function (item) {
                                      return result.append(
                                          key,
                                          stringifyUrlQueryParam(item)
                                      );
                                  })
                                : result.set(
                                      key,
                                      stringifyUrlQueryParam(value)
                                  );
                        }),
                        result
                    );
                }),
                (exports.assign = function (target) {
                    for (
                        var _len = arguments.length,
                            searchParamsList = Array(_len > 1 ? _len - 1 : 0),
                            _key = 1;
                        _key < _len;
                        _key++
                    )
                        searchParamsList[_key - 1] = arguments[_key];
                    return (
                        searchParamsList.forEach(function (searchParams) {
                            Array.from(searchParams.keys()).forEach(function (
                                key
                            ) {
                                return target.delete(key);
                            }),
                                searchParams.forEach(function (value, key) {
                                    return target.append(key, value);
                                });
                        }),
                        target
                    );
                });
        },
        9244: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.removePathPrefix = function (path, prefix) {
                    if (_pathHasPrefix.pathHasPrefix(path, prefix)) {
                        var withoutPrefix = path.slice(prefix.length);
                        return withoutPrefix.startsWith("/")
                            ? withoutPrefix
                            : "/".concat(withoutPrefix);
                    }
                    return path;
                });
            var _pathHasPrefix = __webpack_require__(1259);
        },
        6316: function (__unused_webpack_module, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.removeTrailingSlash = function (route) {
                    return route.replace(/\/$/, "") || "/";
                });
        },
        3888: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.getRouteMatcher = function (param) {
                    var re = param.re,
                        groups = param.groups;
                    return function (pathname) {
                        var routeMatch = re.exec(pathname);
                        if (!routeMatch) return !1;
                        var decode = function (param) {
                                try {
                                    return decodeURIComponent(param);
                                } catch (_) {
                                    throw new _utils.DecodeError(
                                        "failed to decode param"
                                    );
                                }
                            },
                            params = {};
                        return (
                            Object.keys(groups).forEach(function (slugName) {
                                var g = groups[slugName],
                                    m = routeMatch[g.pos];
                                void 0 !== m &&
                                    (params[slugName] = ~m.indexOf("/")
                                        ? m.split("/").map(function (entry) {
                                              return decode(entry);
                                          })
                                        : g.repeat
                                        ? [decode(m)]
                                        : decode(m));
                            }),
                            params
                        );
                    };
                });
            var _utils = __webpack_require__(3794);
        },
        4095: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var _object_spread = __webpack_require__(337).Z,
                _object_spread_props = __webpack_require__(9961).Z;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.getRouteRegex = getRouteRegex),
                (exports.getNamedRouteRegex = function (normalizedRoute) {
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
                }),
                (exports.getMiddlewareRegex = function (
                    normalizedRoute,
                    options
                ) {
                    var ref = getParametrizedRoute(normalizedRoute),
                        parameterizedRoute = ref.parameterizedRoute,
                        groups = ref.groups,
                        _catchAll = (null != options ? options : {}).catchAll,
                        catchAll = void 0 === _catchAll || _catchAll;
                    if ("/" === parameterizedRoute) {
                        var catchAllRegex = catchAll ? ".*" : "";
                        return {
                            groups: {},
                            re: RegExp("^/".concat(catchAllRegex, "$")),
                        };
                    }
                    return {
                        groups: groups,
                        re: RegExp(
                            "^"
                                .concat(parameterizedRoute)
                                .concat(catchAll ? "(?:(/.*)?)" : "", "$")
                        ),
                    };
                }),
                (exports.getNamedMiddlewareRegex = function (
                    normalizedRoute,
                    options
                ) {
                    var parameterizedRoute =
                            getParametrizedRoute(
                                normalizedRoute
                            ).parameterizedRoute,
                        _catchAll = options.catchAll,
                        catchAll = void 0 === _catchAll || _catchAll;
                    if ("/" === parameterizedRoute) {
                        var catchAllRegex = catchAll ? ".*" : "";
                        return {
                            namedRegex: "^/".concat(catchAllRegex, "$"),
                        };
                    }
                    var namedParameterizedRoute =
                        getNamedParametrizedRoute(
                            normalizedRoute
                        ).namedParameterizedRoute;
                    return {
                        namedRegex: "^"
                            .concat(namedParameterizedRoute)
                            .concat(catchAll ? "(?:(/.*)?)" : "", "$"),
                    };
                });
            var _escapeRegexp = __webpack_require__(489),
                _removeTrailingSlash = __webpack_require__(6316);
            function getRouteRegex(normalizedRoute) {
                var ref = getParametrizedRoute(normalizedRoute),
                    parameterizedRoute = ref.parameterizedRoute,
                    groups = ref.groups;
                return {
                    re: RegExp("^".concat(parameterizedRoute, "(?:/)?$")),
                    groups: groups,
                };
            }
            function getParametrizedRoute(route) {
                var segments = _removeTrailingSlash
                        .removeTrailingSlash(route)
                        .slice(1)
                        .split("/"),
                    groups = {},
                    groupIndex = 1;
                return {
                    parameterizedRoute: segments
                        .map(function (segment) {
                            if (
                                !(
                                    segment.startsWith("[") &&
                                    segment.endsWith("]")
                                )
                            )
                                return "/".concat(
                                    _escapeRegexp.escapeStringRegexp(segment)
                                );
                            var ref = parseParameter(segment.slice(1, -1)),
                                key = ref.key,
                                optional = ref.optional,
                                repeat = ref.repeat;
                            return (
                                (groups[key] = {
                                    pos: groupIndex++,
                                    repeat: repeat,
                                    optional: optional,
                                }),
                                repeat
                                    ? optional
                                        ? "(?:/(.+?))?"
                                        : "/(.+?)"
                                    : "/([^/]+?)"
                            );
                        })
                        .join(""),
                    groups: groups,
                };
            }
            function getNamedParametrizedRoute(route) {
                var segments = _removeTrailingSlash
                        .removeTrailingSlash(route)
                        .slice(1)
                        .split("/"),
                    getSafeRouteKey = buildGetSafeRouteKey(),
                    routeKeys = {};
                return {
                    namedParameterizedRoute: segments
                        .map(function (segment) {
                            if (
                                !(
                                    segment.startsWith("[") &&
                                    segment.endsWith("]")
                                )
                            )
                                return "/".concat(
                                    _escapeRegexp.escapeStringRegexp(segment)
                                );
                            var ref = parseParameter(segment.slice(1, -1)),
                                key = ref.key,
                                optional = ref.optional,
                                repeat = ref.repeat,
                                cleanedKey = key.replace(/\W/g, ""),
                                invalidKey = !1;
                            return (
                                (0 === cleanedKey.length ||
                                    cleanedKey.length > 30) &&
                                    (invalidKey = !0),
                                isNaN(parseInt(cleanedKey.slice(0, 1))) ||
                                    (invalidKey = !0),
                                invalidKey && (cleanedKey = getSafeRouteKey()),
                                (routeKeys[cleanedKey] = key),
                                repeat
                                    ? optional
                                        ? "(?:/(?<".concat(
                                              cleanedKey,
                                              ">.+?))?"
                                          )
                                        : "/(?<".concat(cleanedKey, ">.+?)")
                                    : "/(?<".concat(cleanedKey, ">[^/]+?)")
                            );
                        })
                        .join(""),
                    routeKeys: routeKeys,
                };
            }
            function parseParameter(param) {
                var optional = param.startsWith("[") && param.endsWith("]");
                optional && (param = param.slice(1, -1));
                var repeat = param.startsWith("...");
                return (
                    repeat && (param = param.slice(3)),
                    {
                        key: param,
                        repeat: repeat,
                        optional: optional,
                    }
                );
            }
            function buildGetSafeRouteKey() {
                var routeKeyCharCode = 97,
                    routeKeyCharLength = 1;
                return function () {
                    for (var routeKey = "", i = 0; i < routeKeyCharLength; i++)
                        (routeKey += String.fromCharCode(routeKeyCharCode)),
                            ++routeKeyCharCode > 122 &&
                                (routeKeyCharLength++, (routeKeyCharCode = 97));
                    return routeKey;
                };
            }
        },
        3907: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var _class_call_check = __webpack_require__(9658).Z,
                _create_class = __webpack_require__(7222).Z,
                _define_property = __webpack_require__(9361).default,
                _to_consumable_array = __webpack_require__(3929).Z;
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.getSortedRoutes = function (normalizedPages) {
                    var root = new UrlNode();
                    return (
                        normalizedPages.forEach(function (pagePath) {
                            return root.insert(pagePath);
                        }),
                        root.smoosh()
                    );
                });
            var UrlNode = (function () {
                function UrlNode() {
                    _class_call_check(this, UrlNode),
                        _define_property(this, "placeholder", !0),
                        _define_property(this, "children", new Map()),
                        _define_property(this, "slugName", null),
                        _define_property(this, "restSlugName", null),
                        _define_property(this, "optionalRestSlugName", null);
                }
                return (
                    _create_class(UrlNode, [
                        {
                            key: "insert",
                            value: function (urlPath) {
                                this._insert(
                                    urlPath.split("/").filter(Boolean),
                                    [],
                                    !1
                                );
                            },
                        },
                        {
                            key: "smoosh",
                            value: function () {
                                return this._smoosh();
                            },
                        },
                        {
                            key: "_smoosh",
                            value: function () {
                                var prefix =
                                        arguments.length > 0 &&
                                        void 0 !== arguments[0]
                                            ? arguments[0]
                                            : "/",
                                    _this = this,
                                    childrenPaths = _to_consumable_array(
                                        this.children.keys()
                                    ).sort();
                                null !== this.slugName &&
                                    childrenPaths.splice(
                                        childrenPaths.indexOf("[]"),
                                        1
                                    ),
                                    null !== this.restSlugName &&
                                        childrenPaths.splice(
                                            childrenPaths.indexOf("[...]"),
                                            1
                                        ),
                                    null !== this.optionalRestSlugName &&
                                        childrenPaths.splice(
                                            childrenPaths.indexOf("[[...]]"),
                                            1
                                        );
                                var routes = childrenPaths
                                    .map(function (c) {
                                        return _this.children
                                            .get(c)
                                            ._smoosh(
                                                "".concat(prefix).concat(c, "/")
                                            );
                                    })
                                    .reduce(function (prev, curr) {
                                        return _to_consumable_array(
                                            prev
                                        ).concat(_to_consumable_array(curr));
                                    }, []);
                                if (null !== this.slugName) {
                                    var _routes;
                                    (_routes = routes).push.apply(
                                        _routes,
                                        _to_consumable_array(
                                            this.children
                                                .get("[]")
                                                ._smoosh(
                                                    ""
                                                        .concat(prefix, "[")
                                                        .concat(
                                                            this.slugName,
                                                            "]/"
                                                        )
                                                )
                                        )
                                    );
                                }
                                if (!this.placeholder) {
                                    var r =
                                        "/" === prefix
                                            ? "/"
                                            : prefix.slice(0, -1);
                                    if (null != this.optionalRestSlugName)
                                        throw Error(
                                            'You cannot define a route with the same specificity as a optional catch-all route ("'
                                                .concat(r, '" and "')
                                                .concat(r, "[[...")
                                                .concat(
                                                    this.optionalRestSlugName,
                                                    ']]").'
                                                )
                                        );
                                    routes.unshift(r);
                                }
                                if (null !== this.restSlugName) {
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
                                if (null !== this.optionalRestSlugName) {
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
                            value: function (urlPaths, slugNames, isCatchAll) {
                                if (0 === urlPaths.length) {
                                    this.placeholder = !1;
                                    return;
                                }
                                if (isCatchAll)
                                    throw Error(
                                        "Catch-all must be the last part of the URL."
                                    );
                                var nextSegment = urlPaths[0];
                                if (
                                    nextSegment.startsWith("[") &&
                                    nextSegment.endsWith("]")
                                ) {
                                    var handleSlug = function (
                                            previousSlug,
                                            nextSlug
                                        ) {
                                            if (
                                                null !== previousSlug &&
                                                previousSlug !== nextSlug
                                            )
                                                throw Error(
                                                    "You cannot use different slug names for the same dynamic path ('"
                                                        .concat(
                                                            previousSlug,
                                                            "' !== '"
                                                        )
                                                        .concat(nextSlug, "').")
                                                );
                                            slugNames.forEach(function (slug) {
                                                if (slug === nextSlug)
                                                    throw Error(
                                                        'You cannot have the same slug name "'.concat(
                                                            nextSlug,
                                                            '" repeat within a single dynamic path'
                                                        )
                                                    );
                                                if (
                                                    slug.replace(/\W/g, "") ===
                                                    nextSegment.replace(
                                                        /\W/g,
                                                        ""
                                                    )
                                                )
                                                    throw Error(
                                                        'You cannot have the slug names "'
                                                            .concat(
                                                                slug,
                                                                '" and "'
                                                            )
                                                            .concat(
                                                                nextSlug,
                                                                '" differ only by non-word symbols within a single dynamic path'
                                                            )
                                                    );
                                            }),
                                                slugNames.push(nextSlug);
                                        },
                                        segmentName = nextSegment.slice(1, -1),
                                        isOptional = !1;
                                    if (
                                        (segmentName.startsWith("[") &&
                                            segmentName.endsWith("]") &&
                                            ((segmentName = segmentName.slice(
                                                1,
                                                -1
                                            )),
                                            (isOptional = !0)),
                                        segmentName.startsWith("...") &&
                                            ((segmentName =
                                                segmentName.substring(3)),
                                            (isCatchAll = !0)),
                                        segmentName.startsWith("[") ||
                                            segmentName.endsWith("]"))
                                    )
                                        throw Error(
                                            "Segment names may not start or end with extra brackets ('".concat(
                                                segmentName,
                                                "')."
                                            )
                                        );
                                    if (segmentName.startsWith("."))
                                        throw Error(
                                            "Segment names may not start with erroneous periods ('".concat(
                                                segmentName,
                                                "')."
                                            )
                                        );
                                    if (isCatchAll) {
                                        if (isOptional) {
                                            if (null != this.restSlugName)
                                                throw Error(
                                                    'You cannot use both an required and optional catch-all route at the same level ("[...'
                                                        .concat(
                                                            this.restSlugName,
                                                            ']" and "'
                                                        )
                                                        .concat(
                                                            urlPaths[0],
                                                            '" ).'
                                                        )
                                                );
                                            handleSlug(
                                                this.optionalRestSlugName,
                                                segmentName
                                            ),
                                                (this.optionalRestSlugName =
                                                    segmentName),
                                                (nextSegment = "[[...]]");
                                        } else {
                                            if (
                                                null !=
                                                this.optionalRestSlugName
                                            )
                                                throw Error(
                                                    'You cannot use both an optional and required catch-all route at the same level ("[[...'
                                                        .concat(
                                                            this
                                                                .optionalRestSlugName,
                                                            ']]" and "'
                                                        )
                                                        .concat(
                                                            urlPaths[0],
                                                            '").'
                                                        )
                                                );
                                            handleSlug(
                                                this.restSlugName,
                                                segmentName
                                            ),
                                                (this.restSlugName =
                                                    segmentName),
                                                (nextSegment = "[...]");
                                        }
                                    } else {
                                        if (isOptional)
                                            throw Error(
                                                'Optional route parameters are not yet supported ("'.concat(
                                                    urlPaths[0],
                                                    '").'
                                                )
                                            );
                                        handleSlug(this.slugName, segmentName),
                                            (this.slugName = segmentName),
                                            (nextSegment = "[]");
                                    }
                                }
                                this.children.has(nextSegment) ||
                                    this.children.set(
                                        nextSegment,
                                        new UrlNode()
                                    ),
                                    this.children
                                        .get(nextSegment)
                                        ._insert(
                                            urlPaths.slice(1),
                                            slugNames,
                                            isCatchAll
                                        );
                            },
                        },
                    ]),
                    UrlNode
                );
            })();
        },
        8027: function (__unused_webpack_module, exports) {
            "use strict";
            var runtimeConfig;
            function setConfig(configValue) {
                runtimeConfig = configValue;
            }
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.setConfig = setConfig),
                (exports.default = void 0),
                (exports.default = function () {
                    return runtimeConfig;
                });
        },
        5188: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = function (props) {
                    var emitChange = function () {
                            if (headManager && headManager.mountedInstances) {
                                var headElements = _react.Children.toArray(
                                    headManager.mountedInstances
                                ).filter(Boolean);
                                headManager.updateHead(
                                    reduceComponentsToState(headElements, props)
                                );
                            }
                        },
                        headManager = props.headManager,
                        reduceComponentsToState = props.reduceComponentsToState;
                    if (isServer) {
                        var ref;
                        null == headManager ||
                            null == (ref = headManager.mountedInstances) ||
                            ref.add(props.children),
                            emitChange();
                    }
                    return (
                        useClientOnlyLayoutEffect(function () {
                            var ref1;
                            return (
                                null == headManager ||
                                    null ==
                                        (ref1 = headManager.mountedInstances) ||
                                    ref1.add(props.children),
                                function () {
                                    var ref;
                                    null == headManager ||
                                        null ==
                                            (ref =
                                                headManager.mountedInstances) ||
                                        ref.delete(props.children);
                                }
                            );
                        }),
                        useClientOnlyLayoutEffect(function () {
                            return (
                                headManager &&
                                    (headManager._pendingUpdate = emitChange),
                                function () {
                                    headManager &&
                                        (headManager._pendingUpdate =
                                            emitChange);
                                }
                            );
                        }),
                        useClientOnlyEffect(function () {
                            return (
                                headManager &&
                                    headManager._pendingUpdate &&
                                    (headManager._pendingUpdate(),
                                    (headManager._pendingUpdate = null)),
                                function () {
                                    headManager &&
                                        headManager._pendingUpdate &&
                                        (headManager._pendingUpdate(),
                                        (headManager._pendingUpdate = null));
                                }
                            );
                        }),
                        null
                    );
                });
            var _react = (function (obj) {
                if (obj && obj.__esModule) return obj;
                if (
                    null === obj ||
                    ("object" != typeof obj && "function" != typeof obj)
                )
                    return {
                        default: obj,
                    };
                var cache = _getRequireWildcardCache();
                if (cache && cache.has(obj)) return cache.get(obj);
                var newObj = {},
                    hasPropertyDescriptor =
                        Object.defineProperty &&
                        Object.getOwnPropertyDescriptor;
                for (var key in obj)
                    if (Object.prototype.hasOwnProperty.call(obj, key)) {
                        var desc = hasPropertyDescriptor
                            ? Object.getOwnPropertyDescriptor(obj, key)
                            : null;
                        desc && (desc.get || desc.set)
                            ? Object.defineProperty(newObj, key, desc)
                            : (newObj[key] = obj[key]);
                    }
                return (
                    (newObj.default = obj),
                    cache && cache.set(obj, newObj),
                    newObj
                );
            })(__webpack_require__(7294));
            function _getRequireWildcardCache() {
                if ("function" != typeof WeakMap) return null;
                var cache = new WeakMap();
                return (
                    (_getRequireWildcardCache = function () {
                        return cache;
                    }),
                    cache
                );
            }
            var isServer = !1,
                useClientOnlyLayoutEffect = isServer
                    ? function () {}
                    : _react.useLayoutEffect,
                useClientOnlyEffect = isServer
                    ? function () {}
                    : _react.useEffect;
        },
        3794: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            var _async_to_generator = __webpack_require__(932).Z,
                _class_call_check = __webpack_require__(9658).Z,
                _inherits = __webpack_require__(7788).Z,
                _interop_require_default = __webpack_require__(2648).Z,
                _to_consumable_array = __webpack_require__(3929).Z,
                _wrap_native_super = __webpack_require__(9968).Z,
                _create_super = __webpack_require__(7735).Z,
                _runtimeJs = _interop_require_default(
                    __webpack_require__(4051)
                );
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.execOnce = function (fn) {
                    var used = !1,
                        result;
                    return function () {
                        for (
                            var _len = arguments.length,
                                args = Array(_len),
                                _key = 0;
                            _key < _len;
                            _key++
                        )
                            args[_key] = arguments[_key];
                        return (
                            used ||
                                ((used = !0),
                                (result = fn.apply(
                                    void 0,
                                    _to_consumable_array(args)
                                ))),
                            result
                        );
                    };
                }),
                (exports.getLocationOrigin = getLocationOrigin),
                (exports.getURL = function () {
                    var href = window.location.href,
                        origin = getLocationOrigin();
                    return href.substring(origin.length);
                }),
                (exports.getDisplayName = getDisplayName),
                (exports.isResSent = isResSent),
                (exports.normalizeRepeatedSlashes = function (url) {
                    var urlParts = url.split("?"),
                        urlNoQuery = urlParts[0];
                    return (
                        urlNoQuery.replace(/\\/g, "/").replace(/\/\/+/g, "/") +
                        (urlParts[1]
                            ? "?".concat(urlParts.slice(1).join("?"))
                            : "")
                    );
                }),
                (exports.loadGetInitialProps = loadGetInitialProps),
                (exports.ST =
                    exports.SP =
                    exports.warnOnce =
                    exports.isAbsoluteUrl =
                        void 0);
            var ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
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
            function getDisplayName(Component) {
                return "string" == typeof Component
                    ? Component
                    : Component.displayName || Component.name || "Unknown";
            }
            function isResSent(res) {
                return res.finished || res.headersSent;
            }
            function loadGetInitialProps(App, ctx) {
                return _loadGetInitialProps.apply(this, arguments);
            }
            function _loadGetInitialProps() {
                return (_loadGetInitialProps = _async_to_generator(
                    _runtimeJs.default.mark(function _callee(App, ctx) {
                        var res, props, message1;
                        return _runtimeJs.default.wrap(function (_ctx) {
                            for (;;)
                                switch ((_ctx.prev = _ctx.next)) {
                                    case 0:
                                        _ctx.next = 5;
                                        break;
                                    case 5:
                                        if (
                                            ((res =
                                                ctx.res ||
                                                (ctx.ctx && ctx.ctx.res)),
                                            App.getInitialProps)
                                        ) {
                                            _ctx.next = 13;
                                            break;
                                        }
                                        if (!(ctx.ctx && ctx.Component)) {
                                            _ctx.next = 12;
                                            break;
                                        }
                                        return (
                                            (_ctx.next = 10),
                                            loadGetInitialProps(
                                                ctx.Component,
                                                ctx.ctx
                                            )
                                        );
                                    case 10:
                                        return (
                                            (_ctx.t0 = _ctx.sent),
                                            _ctx.abrupt("return", {
                                                pageProps: _ctx.t0,
                                            })
                                        );
                                    case 12:
                                        return _ctx.abrupt("return", {});
                                    case 13:
                                        return (
                                            (_ctx.next = 15),
                                            App.getInitialProps(ctx)
                                        );
                                    case 15:
                                        if (
                                            ((props = _ctx.sent),
                                            !(res && isResSent(res)))
                                        ) {
                                            _ctx.next = 18;
                                            break;
                                        }
                                        return _ctx.abrupt("return", props);
                                    case 18:
                                        if (props) {
                                            _ctx.next = 21;
                                            break;
                                        }
                                        throw Error(
                                            (message1 = '"'
                                                .concat(
                                                    getDisplayName(App),
                                                    '.getInitialProps()" should resolve to an object. But found "'
                                                )
                                                .concat(props, '" instead.'))
                                        );
                                    case 21:
                                        return _ctx.abrupt("return", props);
                                    case 23:
                                    case "end":
                                        return _ctx.stop();
                                }
                        }, _callee);
                    })
                )).apply(this, arguments);
            }
            exports.isAbsoluteUrl = function (url) {
                return ABSOLUTE_URL_REGEX.test(url);
            };
            var SP = "undefined" != typeof performance;
            exports.SP = SP;
            var ST =
                SP &&
                "function" == typeof performance.mark &&
                "function" == typeof performance.measure;
            exports.ST = ST;
            var DecodeError = (function (Error1) {
                _inherits(DecodeError, Error1);
                var _super = _create_super(DecodeError);
                function DecodeError() {
                    return (
                        _class_call_check(this, DecodeError),
                        _super.apply(this, arguments)
                    );
                }
                return DecodeError;
            })(_wrap_native_super(Error));
            exports.DecodeError = DecodeError;
            var NormalizeError = (function (Error1) {
                _inherits(NormalizeError, Error1);
                var _super = _create_super(NormalizeError);
                function NormalizeError() {
                    return (
                        _class_call_check(this, NormalizeError),
                        _super.apply(this, arguments)
                    );
                }
                return NormalizeError;
            })(_wrap_native_super(Error));
            exports.NormalizeError = NormalizeError;
            var PageNotFoundError = (function (Error1) {
                _inherits(PageNotFoundError, Error1);
                var _super = _create_super(PageNotFoundError);
                function PageNotFoundError(page) {
                    var _this;
                    return (
                        _class_call_check(this, PageNotFoundError),
                        ((_this = _super.call(this)).code = "ENOENT"),
                        (_this.message = "Cannot find module for page: ".concat(
                            page
                        )),
                        _this
                    );
                }
                return PageNotFoundError;
            })(_wrap_native_super(Error));
            exports.PageNotFoundError = PageNotFoundError;
            var MissingStaticPage = (function (Error1) {
                _inherits(MissingStaticPage, Error1);
                var _super = _create_super(MissingStaticPage);
                function MissingStaticPage(page, message) {
                    var _this;
                    return (
                        _class_call_check(this, MissingStaticPage),
                        ((_this = _super.call(this)).message =
                            "Failed to load static file for page: "
                                .concat(page, " ")
                                .concat(message)),
                        _this
                    );
                }
                return MissingStaticPage;
            })(_wrap_native_super(Error));
            exports.MissingStaticPage = MissingStaticPage;
            var MiddlewareNotFoundError = (function (Error1) {
                _inherits(MiddlewareNotFoundError, Error1);
                var _super = _create_super(MiddlewareNotFoundError);
                function MiddlewareNotFoundError() {
                    var _this;
                    return (
                        _class_call_check(this, MiddlewareNotFoundError),
                        ((_this = _super.call(this)).code = "ENOENT"),
                        (_this.message = "Cannot find the middleware module"),
                        _this
                    );
                }
                return MiddlewareNotFoundError;
            })(_wrap_native_super(Error));
            (exports.MiddlewareNotFoundError = MiddlewareNotFoundError),
                (exports.warnOnce = function (_) {});
        },
        4051: function (module) {
            var runtime = (function (exports) {
                "use strict";
                var Op = Object.prototype,
                    hasOwn = Op.hasOwnProperty,
                    undefined,
                    $Symbol = "function" == typeof Symbol ? Symbol : {},
                    iteratorSymbol = $Symbol.iterator || "@@iterator",
                    asyncIteratorSymbol =
                        $Symbol.asyncIterator || "@@asyncIterator",
                    toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
                function wrap(innerFn, outerFn, self1, tryLocsList) {
                    var protoGenerator =
                            outerFn && outerFn.prototype instanceof Generator
                                ? outerFn
                                : Generator,
                        generator = Object.create(protoGenerator.prototype),
                        context = new Context(tryLocsList || []);
                    return (
                        (generator._invoke = makeInvokeMethod(
                            innerFn,
                            self1,
                            context
                        )),
                        generator
                    );
                }
                function tryCatch(fn, obj, arg) {
                    try {
                        return {
                            type: "normal",
                            arg: fn.call(obj, arg),
                        };
                    } catch (err) {
                        return {
                            type: "throw",
                            arg: err,
                        };
                    }
                }
                exports.wrap = wrap;
                var GenStateSuspendedStart = "suspendedStart",
                    GenStateExecuting = "executing",
                    GenStateCompleted = "completed",
                    ContinueSentinel = {};
                function Generator() {}
                function GeneratorFunction() {}
                function GeneratorFunctionPrototype() {}
                var IteratorPrototype = {};
                IteratorPrototype[iteratorSymbol] = function () {
                    return this;
                };
                var getProto = Object.getPrototypeOf,
                    NativeIteratorPrototype =
                        getProto && getProto(getProto(values([])));
                NativeIteratorPrototype &&
                    NativeIteratorPrototype !== Op &&
                    hasOwn.call(NativeIteratorPrototype, iteratorSymbol) &&
                    (IteratorPrototype = NativeIteratorPrototype);
                var Gp =
                    (GeneratorFunctionPrototype.prototype =
                    Generator.prototype =
                        Object.create(IteratorPrototype));
                function defineIteratorMethods(prototype) {
                    ["next", "throw", "return"].forEach(function (method) {
                        prototype[method] = function (arg) {
                            return this._invoke(method, arg);
                        };
                    });
                }
                function AsyncIterator(generator, PromiseImpl) {
                    function invoke(method, arg, resolve, reject) {
                        var record = tryCatch(
                            generator[method],
                            generator,
                            arg
                        );
                        if ("throw" === record.type) reject(record.arg);
                        else {
                            var result = record.arg,
                                value = result.value;
                            return value &&
                                "object" == typeof value &&
                                hasOwn.call(value, "__await")
                                ? PromiseImpl.resolve(value.__await).then(
                                      function (value) {
                                          invoke(
                                              "next",
                                              value,
                                              resolve,
                                              reject
                                          );
                                      },
                                      function (err) {
                                          invoke("throw", err, resolve, reject);
                                      }
                                  )
                                : PromiseImpl.resolve(value).then(
                                      function (unwrapped) {
                                          (result.value = unwrapped),
                                              resolve(result);
                                      },
                                      function (error) {
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
                    this._invoke = function (method, arg) {
                        function callInvokeWithMethodAndArg() {
                            return new PromiseImpl(function (resolve, reject) {
                                invoke(method, arg, resolve, reject);
                            });
                        }
                        return (previousPromise = previousPromise
                            ? previousPromise.then(
                                  callInvokeWithMethodAndArg,
                                  callInvokeWithMethodAndArg
                              )
                            : callInvokeWithMethodAndArg());
                    };
                }
                function makeInvokeMethod(innerFn, self1, context) {
                    var state = GenStateSuspendedStart;
                    return function (method, arg) {
                        if (state === GenStateExecuting)
                            throw Error("Generator is already running");
                        if (state === GenStateCompleted) {
                            if ("throw" === method) throw arg;
                            return doneResult();
                        }
                        for (context.method = method, context.arg = arg; ; ) {
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
                            if ("next" === context.method)
                                context.sent = context._sent = context.arg;
                            else if ("throw" === context.method) {
                                if (state === GenStateSuspendedStart)
                                    throw (
                                        ((state = GenStateCompleted),
                                        context.arg)
                                    );
                                context.dispatchException(context.arg);
                            } else
                                "return" === context.method &&
                                    context.abrupt("return", context.arg);
                            state = GenStateExecuting;
                            var record = tryCatch(innerFn, self1, context);
                            if ("normal" === record.type) {
                                if (
                                    ((state = context.done
                                        ? GenStateCompleted
                                        : "suspendedYield"),
                                    record.arg === ContinueSentinel)
                                )
                                    continue;
                                return {
                                    value: record.arg,
                                    done: context.done,
                                };
                            }
                            "throw" === record.type &&
                                ((state = GenStateCompleted),
                                (context.method = "throw"),
                                (context.arg = record.arg));
                        }
                    };
                }
                function maybeInvokeDelegate(delegate, context) {
                    var method = delegate.iterator[context.method];
                    if (method === undefined) {
                        if (
                            ((context.delegate = null),
                            "throw" === context.method)
                        ) {
                            if (
                                delegate.iterator.return &&
                                ((context.method = "return"),
                                (context.arg = undefined),
                                maybeInvokeDelegate(delegate, context),
                                "throw" === context.method)
                            )
                                return ContinueSentinel;
                            (context.method = "throw"),
                                (context.arg = TypeError(
                                    "The iterator does not provide a 'throw' method"
                                ));
                        }
                        return ContinueSentinel;
                    }
                    var record = tryCatch(
                        method,
                        delegate.iterator,
                        context.arg
                    );
                    if ("throw" === record.type)
                        return (
                            (context.method = "throw"),
                            (context.arg = record.arg),
                            (context.delegate = null),
                            ContinueSentinel
                        );
                    var info = record.arg;
                    return info
                        ? info.done
                            ? ((context[delegate.resultName] = info.value),
                              (context.next = delegate.nextLoc),
                              "return" !== context.method &&
                                  ((context.method = "next"),
                                  (context.arg = undefined)),
                              (context.delegate = null),
                              ContinueSentinel)
                            : info
                        : ((context.method = "throw"),
                          (context.arg = TypeError(
                              "iterator result is not an object"
                          )),
                          (context.delegate = null),
                          ContinueSentinel);
                }
                function pushTryEntry(locs) {
                    var entry = {
                        tryLoc: locs[0],
                    };
                    1 in locs && (entry.catchLoc = locs[1]),
                        2 in locs &&
                            ((entry.finallyLoc = locs[2]),
                            (entry.afterLoc = locs[3])),
                        this.tryEntries.push(entry);
                }
                function resetTryEntry(entry) {
                    var record = entry.completion || {};
                    (record.type = "normal"),
                        delete record.arg,
                        (entry.completion = record);
                }
                function Context(tryLocsList) {
                    (this.tryEntries = [
                        {
                            tryLoc: "root",
                        },
                    ]),
                        tryLocsList.forEach(pushTryEntry, this),
                        this.reset(!0);
                }
                function values(iterable) {
                    if (iterable) {
                        var iteratorMethod = iterable[iteratorSymbol];
                        if (iteratorMethod)
                            return iteratorMethod.call(iterable);
                        if ("function" == typeof iterable.next) return iterable;
                        if (!isNaN(iterable.length)) {
                            var i = -1,
                                next = function next() {
                                    for (; ++i < iterable.length; )
                                        if (hasOwn.call(iterable, i))
                                            return (
                                                (next.value = iterable[i]),
                                                (next.done = !1),
                                                next
                                            );
                                    return (
                                        (next.value = undefined),
                                        (next.done = !0),
                                        next
                                    );
                                };
                            return (next.next = next);
                        }
                    }
                    return {
                        next: doneResult,
                    };
                }
                function doneResult() {
                    return {
                        value: undefined,
                        done: !0,
                    };
                }
                return (
                    (GeneratorFunction.prototype = Gp.constructor =
                        GeneratorFunctionPrototype),
                    (GeneratorFunctionPrototype.constructor =
                        GeneratorFunction),
                    (GeneratorFunctionPrototype[toStringTagSymbol] =
                        GeneratorFunction.displayName =
                            "GeneratorFunction"),
                    (exports.isGeneratorFunction = function (genFun) {
                        var ctor =
                            "function" == typeof genFun && genFun.constructor;
                        return (
                            !!ctor &&
                            (ctor === GeneratorFunction ||
                                "GeneratorFunction" ===
                                    (ctor.displayName || ctor.name))
                        );
                    }),
                    (exports.mark = function (genFun) {
                        return (
                            Object.setPrototypeOf
                                ? Object.setPrototypeOf(
                                      genFun,
                                      GeneratorFunctionPrototype
                                  )
                                : ((genFun.__proto__ =
                                      GeneratorFunctionPrototype),
                                  toStringTagSymbol in genFun ||
                                      (genFun[toStringTagSymbol] =
                                          "GeneratorFunction")),
                            (genFun.prototype = Object.create(Gp)),
                            genFun
                        );
                    }),
                    (exports.awrap = function (arg) {
                        return {
                            __await: arg,
                        };
                    }),
                    defineIteratorMethods(AsyncIterator.prototype),
                    (AsyncIterator.prototype[asyncIteratorSymbol] =
                        function () {
                            return this;
                        }),
                    (exports.AsyncIterator = AsyncIterator),
                    (exports.async = function (
                        innerFn,
                        outerFn,
                        self1,
                        tryLocsList,
                        PromiseImpl
                    ) {
                        void 0 === PromiseImpl && (PromiseImpl = Promise);
                        var iter = new AsyncIterator(
                            wrap(innerFn, outerFn, self1, tryLocsList),
                            PromiseImpl
                        );
                        return exports.isGeneratorFunction(outerFn)
                            ? iter
                            : iter.next().then(function (result) {
                                  return result.done
                                      ? result.value
                                      : iter.next();
                              });
                    }),
                    defineIteratorMethods(Gp),
                    (Gp[toStringTagSymbol] = "Generator"),
                    (Gp[iteratorSymbol] = function () {
                        return this;
                    }),
                    (Gp.toString = function () {
                        return "[object Generator]";
                    }),
                    (exports.keys = function (object) {
                        var keys = [];
                        for (var key in object) keys.push(key);
                        return (
                            keys.reverse(),
                            function next() {
                                for (; keys.length; ) {
                                    var key = keys.pop();
                                    if (key in object)
                                        return (
                                            (next.value = key),
                                            (next.done = !1),
                                            next
                                        );
                                }
                                return (next.done = !0), next;
                            }
                        );
                    }),
                    (exports.values = values),
                    (Context.prototype = {
                        constructor: Context,
                        reset: function (skipTempReset) {
                            if (
                                ((this.prev = 0),
                                (this.next = 0),
                                (this.sent = this._sent = undefined),
                                (this.done = !1),
                                (this.delegate = null),
                                (this.method = "next"),
                                (this.arg = undefined),
                                this.tryEntries.forEach(resetTryEntry),
                                !skipTempReset)
                            )
                                for (var name in this)
                                    "t" === name.charAt(0) &&
                                        hasOwn.call(this, name) &&
                                        !isNaN(+name.slice(1)) &&
                                        (this[name] = undefined);
                        },
                        stop: function () {
                            this.done = !0;
                            var rootEntry = this.tryEntries[0],
                                rootRecord = rootEntry.completion;
                            if ("throw" === rootRecord.type)
                                throw rootRecord.arg;
                            return this.rval;
                        },
                        dispatchException: function (exception) {
                            if (this.done) throw exception;
                            var context = this;
                            function handle(loc, caught) {
                                return (
                                    (record.type = "throw"),
                                    (record.arg = exception),
                                    (context.next = loc),
                                    caught &&
                                        ((context.method = "next"),
                                        (context.arg = undefined)),
                                    !!caught
                                );
                            }
                            for (
                                var i = this.tryEntries.length - 1;
                                i >= 0;
                                --i
                            ) {
                                var entry = this.tryEntries[i],
                                    record = entry.completion;
                                if ("root" === entry.tryLoc)
                                    return handle("end");
                                if (entry.tryLoc <= this.prev) {
                                    var hasCatch = hasOwn.call(
                                            entry,
                                            "catchLoc"
                                        ),
                                        hasFinally = hasOwn.call(
                                            entry,
                                            "finallyLoc"
                                        );
                                    if (hasCatch && hasFinally) {
                                        if (this.prev < entry.catchLoc)
                                            return handle(entry.catchLoc, !0);
                                        if (this.prev < entry.finallyLoc)
                                            return handle(entry.finallyLoc);
                                    } else if (hasCatch) {
                                        if (this.prev < entry.catchLoc)
                                            return handle(entry.catchLoc, !0);
                                    } else if (hasFinally) {
                                        if (this.prev < entry.finallyLoc)
                                            return handle(entry.finallyLoc);
                                    } else
                                        throw Error(
                                            "try statement without catch or finally"
                                        );
                                }
                            }
                        },
                        abrupt: function (type, arg) {
                            for (
                                var i = this.tryEntries.length - 1;
                                i >= 0;
                                --i
                            ) {
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
                            finallyEntry &&
                                ("break" === type || "continue" === type) &&
                                finallyEntry.tryLoc <= arg &&
                                arg <= finallyEntry.finallyLoc &&
                                (finallyEntry = null);
                            var record = finallyEntry
                                ? finallyEntry.completion
                                : {};
                            return ((record.type = type),
                            (record.arg = arg),
                            finallyEntry)
                                ? ((this.method = "next"),
                                  (this.next = finallyEntry.finallyLoc),
                                  ContinueSentinel)
                                : this.complete(record);
                        },
                        complete: function (record, afterLoc) {
                            if ("throw" === record.type) throw record.arg;
                            return (
                                "break" === record.type ||
                                "continue" === record.type
                                    ? (this.next = record.arg)
                                    : "return" === record.type
                                    ? ((this.rval = this.arg = record.arg),
                                      (this.method = "return"),
                                      (this.next = "end"))
                                    : "normal" === record.type &&
                                      afterLoc &&
                                      (this.next = afterLoc),
                                ContinueSentinel
                            );
                        },
                        finish: function (finallyLoc) {
                            for (
                                var i = this.tryEntries.length - 1;
                                i >= 0;
                                --i
                            ) {
                                var entry = this.tryEntries[i];
                                if (entry.finallyLoc === finallyLoc)
                                    return (
                                        this.complete(
                                            entry.completion,
                                            entry.afterLoc
                                        ),
                                        resetTryEntry(entry),
                                        ContinueSentinel
                                    );
                            }
                        },
                        catch: function (tryLoc) {
                            for (
                                var i = this.tryEntries.length - 1;
                                i >= 0;
                                --i
                            ) {
                                var entry = this.tryEntries[i];
                                if (entry.tryLoc === tryLoc) {
                                    var record = entry.completion;
                                    if ("throw" === record.type) {
                                        var thrown = record.arg;
                                        resetTryEntry(entry);
                                    }
                                    return thrown;
                                }
                            }
                            throw Error("illegal catch attempt");
                        },
                        delegateYield: function (
                            iterable,
                            resultName,
                            nextLoc
                        ) {
                            return (
                                (this.delegate = {
                                    iterator: values(iterable),
                                    resultName: resultName,
                                    nextLoc: nextLoc,
                                }),
                                "next" === this.method &&
                                    (this.arg = undefined),
                                ContinueSentinel
                            );
                        },
                    }),
                    exports
                );
            })(module.exports);
            try {
                regeneratorRuntime = runtime;
            } catch (accidentalStrictMode) {
                Function("r", "regeneratorRuntime = r")(runtime);
            }
        },
        8745: function (module) {
            var n;
            "undefined" != typeof __nccwpck_require__ &&
                (__nccwpck_require__.ab = "//"),
                {
                    61: function (e, n) {
                        !(function (e, o) {
                            o(n);
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
                                    } catch (e1) {}
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
                                N = {
                                    passive: !0,
                                    capture: !0,
                                },
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
                                                e.timeStamp,
                                            e1,
                                            n1,
                                            t,
                                            i,
                                            r;
                                        "pointerdown" == e.type
                                            ? ((e1 = n),
                                              (n1 = e),
                                              (t = function () {
                                                  L(e1, n1), r();
                                              }),
                                              (i = function () {
                                                  r();
                                              }),
                                              (r = function () {
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
                                              }),
                                              addEventListener(
                                                  "pointerup",
                                                  t,
                                                  N
                                              ),
                                              addEventListener(
                                                  "pointercancel",
                                                  i,
                                                  N
                                              ))
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
                }[61](0, (n = {})),
                (module.exports = n);
        },
        676: function (__unused_webpack_module, exports, __webpack_require__) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: !0,
            }),
                (exports.default = isError),
                (exports.getProperError = function (err) {
                    return isError(err)
                        ? err
                        : Error(
                              _isPlainObject.isPlainObject(err)
                                  ? JSON.stringify(err)
                                  : err + ""
                          );
                });
            var _isPlainObject = __webpack_require__(8887);
            function isError(err) {
                return (
                    "object" == typeof err &&
                    null !== err &&
                    "name" in err &&
                    "message" in err
                );
            }
        },
        2431: function () {},
    },
    function (__webpack_require__) {
        __webpack_require__.O(0, [774], function () {
            return __webpack_require__((__webpack_require__.s = 2870));
        });
        var __webpack_exports__ = __webpack_require__.O();
        _N_E = __webpack_exports__;
    },
]);
