(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [179],
    {
        /***/ 4291: /***/ function (module) {
            function _arrayLikeToArray(arr, len) {
                if (len == null || len > arr.length) len = arr.length;

                for (var i = 0, arr2 = new Array(len); i < len; i++) {
                    arr2[i] = arr[i];
                }

                return arr2;
            }

            module.exports = _arrayLikeToArray;

            /***/
        },

        /***/ 4325: /***/ function (module) {
            function _arrayWithHoles(arr) {
                if (Array.isArray(arr)) return arr;
            }

            module.exports = _arrayWithHoles;

            /***/
        },

        /***/ 123: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            var arrayLikeToArray = __webpack_require__(4291);

            function _arrayWithoutHoles(arr) {
                if (Array.isArray(arr)) return arrayLikeToArray(arr);
            }

            module.exports = _arrayWithoutHoles;

            /***/
        },

        /***/ 9382: /***/ function (module) {
            function _assertThisInitialized(self) {
                if (self === void 0) {
                    throw new ReferenceError(
                        "this hasn't been initialised - super() hasn't been called"
                    );
                }

                return self;
            }

            module.exports = _assertThisInitialized;

            /***/
        },

        /***/ 5374: /***/ function (module) {
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

            module.exports = _asyncToGenerator;

            /***/
        },

        /***/ 4988: /***/ function (module) {
            function _classCallCheck(instance, Constructor) {
                if (!(instance instanceof Constructor)) {
                    throw new TypeError("Cannot call a class as a function");
                }
            }

            module.exports = _classCallCheck;

            /***/
        },

        /***/ 4096: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            var setPrototypeOf = __webpack_require__(990);

            var isNativeReflectConstruct = __webpack_require__(6340);

            function _construct(Parent, args, Class) {
                if (isNativeReflectConstruct()) {
                    module.exports = _construct = Reflect.construct;
                } else {
                    module.exports = _construct = function _construct(
                        Parent,
                        args,
                        Class
                    ) {
                        var a = [null];
                        a.push.apply(a, args);
                        var Constructor = Function.bind.apply(Parent, a);
                        var instance = new Constructor();
                        if (Class) setPrototypeOf(instance, Class.prototype);
                        return instance;
                    };
                }

                return _construct.apply(null, arguments);
            }

            module.exports = _construct;

            /***/
        },

        /***/ 9590: /***/ function (module) {
            function _defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    Object.defineProperty(target, descriptor.key, descriptor);
                }
            }

            function _createClass(Constructor, protoProps, staticProps) {
                if (protoProps)
                    _defineProperties(Constructor.prototype, protoProps);
                if (staticProps) _defineProperties(Constructor, staticProps);
                return Constructor;
            }

            module.exports = _createClass;

            /***/
        },

        /***/ 566: /***/ function (module) {
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

            module.exports = _defineProperty;

            /***/
        },

        /***/ 852: /***/ function (module) {
            function _getPrototypeOf(o) {
                module.exports = _getPrototypeOf = Object.setPrototypeOf
                    ? Object.getPrototypeOf
                    : function _getPrototypeOf(o) {
                          return o.__proto__ || Object.getPrototypeOf(o);
                      };
                return _getPrototypeOf(o);
            }

            module.exports = _getPrototypeOf;

            /***/
        },

        /***/ 4546: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            var setPrototypeOf = __webpack_require__(990);

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
                if (superClass) setPrototypeOf(subClass, superClass);
            }

            module.exports = _inherits;

            /***/
        },

        /***/ 6571: /***/ function (module) {
            function _isNativeFunction(fn) {
                return (
                    Function.toString.call(fn).indexOf("[native code]") !== -1
                );
            }

            module.exports = _isNativeFunction;

            /***/
        },

        /***/ 6340: /***/ function (module) {
            function _isNativeReflectConstruct() {
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

            module.exports = _isNativeReflectConstruct;

            /***/
        },

        /***/ 6506: /***/ function (module) {
            function _iterableToArray(iter) {
                if (
                    typeof Symbol !== "undefined" &&
                    Symbol.iterator in Object(iter)
                )
                    return Array.from(iter);
            }

            module.exports = _iterableToArray;

            /***/
        },

        /***/ 1682: /***/ function (module) {
            function _iterableToArrayLimit(arr, i) {
                if (
                    typeof Symbol === "undefined" ||
                    !(Symbol.iterator in Object(arr))
                )
                    return;
                var _arr = [];
                var _n = true;
                var _d = false;
                var _e = undefined;

                try {
                    for (
                        var _i = arr[Symbol.iterator](), _s;
                        !(_n = (_s = _i.next()).done);
                        _n = true
                    ) {
                        _arr.push(_s.value);

                        if (i && _arr.length === i) break;
                    }
                } catch (err) {
                    _d = true;
                    _e = err;
                } finally {
                    try {
                        if (!_n && _i["return"] != null) _i["return"]();
                    } finally {
                        if (_d) throw _e;
                    }
                }

                return _arr;
            }

            module.exports = _iterableToArrayLimit;

            /***/
        },

        /***/ 1420: /***/ function (module) {
            function _nonIterableRest() {
                throw new TypeError(
                    "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                );
            }

            module.exports = _nonIterableRest;

            /***/
        },

        /***/ 7331: /***/ function (module) {
            function _nonIterableSpread() {
                throw new TypeError(
                    "Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                );
            }

            module.exports = _nonIterableSpread;

            /***/
        },

        /***/ 1581: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            var _typeof = __webpack_require__(7002);

            var assertThisInitialized = __webpack_require__(9382);

            function _possibleConstructorReturn(self, call) {
                if (
                    call &&
                    (_typeof(call) === "object" || typeof call === "function")
                ) {
                    return call;
                }

                return assertThisInitialized(self);
            }

            module.exports = _possibleConstructorReturn;

            /***/
        },

        /***/ 990: /***/ function (module) {
            function _setPrototypeOf(o, p) {
                module.exports = _setPrototypeOf =
                    Object.setPrototypeOf ||
                    function _setPrototypeOf(o, p) {
                        o.__proto__ = p;
                        return o;
                    };

                return _setPrototypeOf(o, p);
            }

            module.exports = _setPrototypeOf;

            /***/
        },

        /***/ 3408: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            var arrayWithHoles = __webpack_require__(4325);

            var iterableToArrayLimit = __webpack_require__(1682);

            var unsupportedIterableToArray = __webpack_require__(2510);

            var nonIterableRest = __webpack_require__(1420);

            function _slicedToArray(arr, i) {
                return (
                    arrayWithHoles(arr) ||
                    iterableToArrayLimit(arr, i) ||
                    unsupportedIterableToArray(arr, i) ||
                    nonIterableRest()
                );
            }

            module.exports = _slicedToArray;

            /***/
        },

        /***/ 9571: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            var arrayWithoutHoles = __webpack_require__(123);

            var iterableToArray = __webpack_require__(6506);

            var unsupportedIterableToArray = __webpack_require__(2510);

            var nonIterableSpread = __webpack_require__(7331);

            function _toConsumableArray(arr) {
                return (
                    arrayWithoutHoles(arr) ||
                    iterableToArray(arr) ||
                    unsupportedIterableToArray(arr) ||
                    nonIterableSpread()
                );
            }

            module.exports = _toConsumableArray;

            /***/
        },

        /***/ 7002: /***/ function (module) {
            function _typeof(obj) {
                "@babel/helpers - typeof";

                if (
                    typeof Symbol === "function" &&
                    typeof Symbol.iterator === "symbol"
                ) {
                    module.exports = _typeof = function _typeof(obj) {
                        return typeof obj;
                    };
                } else {
                    module.exports = _typeof = function _typeof(obj) {
                        return obj &&
                            typeof Symbol === "function" &&
                            obj.constructor === Symbol &&
                            obj !== Symbol.prototype
                            ? "symbol"
                            : typeof obj;
                    };
                }

                return _typeof(obj);
            }

            module.exports = _typeof;

            /***/
        },

        /***/ 2510: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            var arrayLikeToArray = __webpack_require__(4291);

            function _unsupportedIterableToArray(o, minLen) {
                if (!o) return;
                if (typeof o === "string") return arrayLikeToArray(o, minLen);
                var n = Object.prototype.toString.call(o).slice(8, -1);
                if (n === "Object" && o.constructor) n = o.constructor.name;
                if (n === "Map" || n === "Set") return Array.from(o);
                if (
                    n === "Arguments" ||
                    /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                )
                    return arrayLikeToArray(o, minLen);
            }

            module.exports = _unsupportedIterableToArray;

            /***/
        },

        /***/ 8545: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            var getPrototypeOf = __webpack_require__(852);

            var setPrototypeOf = __webpack_require__(990);

            var isNativeFunction = __webpack_require__(6571);

            var construct = __webpack_require__(4096);

            function _wrapNativeSuper(Class) {
                var _cache = typeof Map === "function" ? new Map() : undefined;

                module.exports = _wrapNativeSuper = function _wrapNativeSuper(
                    Class
                ) {
                    if (Class === null || !isNativeFunction(Class))
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
                        return construct(
                            Class,
                            arguments,
                            getPrototypeOf(this).constructor
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
                    return setPrototypeOf(Wrapper, Class);
                };

                return _wrapNativeSuper(Class);
            }

            module.exports = _wrapNativeSuper;

            /***/
        },

        /***/ 7945: /***/ function (
            module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            module.exports = __webpack_require__(1602);

            /***/
        },

        /***/ 1602: /***/ function (module) {
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
                    return {
                        __await: arg,
                    };
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
                    var entry = {
                        tryLoc: locs[0],
                    };

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
                    this.tryEntries = [
                        {
                            tryLoc: "root",
                        },
                    ];
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
                    return {
                        next: doneResult,
                    };
                }
                exports.values = values;

                function doneResult() {
                    return {
                        value: undefined,
                        done: true,
                    };
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

        /***/ 5193: /***/ function () {
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

        /***/ 4424: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.default = initHeadManager;
            exports.DOMAttributeNames = void 0;
            var DOMAttributeNames = {
                acceptCharset: "accept-charset",
                className: "class",
                htmlFor: "for",
                httpEquiv: "http-equiv",
                noModule: "noModule",
            };
            exports.DOMAttributeNames = DOMAttributeNames;

            function reactElementToDOM(_ref) {
                var type = _ref.type,
                    props = _ref.props;
                var el = document.createElement(type);

                for (var p in props) {
                    if (!props.hasOwnProperty(p)) continue;
                    if (p === "children" || p === "dangerouslySetInnerHTML")
                        continue; // we don't render undefined props to the DOM

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
                    i++, j = j.previousElementSibling
                ) {
                    if (j.tagName.toLowerCase() === type) {
                        oldTags.push(j);
                    }
                }

                var newTags = components
                    .map(reactElementToDOM)
                    .filter(function (newTag) {
                        for (var k = 0, len = oldTags.length; k < len; k++) {
                            var oldTag = oldTags[k];

                            if (oldTag.isEqualNode(newTag)) {
                                oldTags.splice(k, 1);
                                return false;
                            }
                        }

                        return true;
                    });
                oldTags.forEach(function (t) {
                    return t.parentNode.removeChild(t);
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

            function initHeadManager() {
                var updatePromise = null;
                return {
                    mountedInstances: new Set(),
                    updateHead: function updateHead(head) {
                        var promise = (updatePromise = Promise.resolve().then(
                            function () {
                                if (promise !== updatePromise) return;
                                updatePromise = null;
                                var tags = {};
                                head.forEach(function (h) {
                                    if (
                                        // If the font tag is loaded only on client navigation
                                        // it won't be inlined. In this case revert to the original behavior
                                        h.type === "link" &&
                                        h.props["data-optimized-fonts"] &&
                                        !document.querySelector(
                                            'style[data-href="'.concat(
                                                h.props["data-href"],
                                                '"]'
                                            )
                                        )
                                    ) {
                                        h.props.href = h.props["data-href"];
                                        h.props["data-href"] = undefined;
                                    }

                                    var components = tags[h.type] || [];
                                    components.push(h);
                                    tags[h.type] = components;
                                });
                                var titleComponent = tags.title
                                    ? tags.title[0]
                                    : null;
                                var title = "";

                                if (titleComponent) {
                                    var children =
                                        titleComponent.props.children;
                                    title =
                                        typeof children === "string"
                                            ? children
                                            : Array.isArray(children)
                                            ? children.join("")
                                            : "";
                                }

                                if (title !== document.title)
                                    document.title = title;
                                [
                                    "meta",
                                    "base",
                                    "link",
                                    "style",
                                    "script",
                                ].forEach(function (type) {
                                    updateElements(type, tags[type] || []);
                                });
                            }
                        ));
                    },
                };
            }

            /***/
        },

        /***/ 9201: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _regeneratorRuntime = __webpack_require__(7945);

            var _classCallCheck = __webpack_require__(4988);

            var _createClass = __webpack_require__(9590);

            var _inherits = __webpack_require__(4546);

            var _possibleConstructorReturn = __webpack_require__(1581);

            var _getPrototypeOf = __webpack_require__(852);

            var _slicedToArray = __webpack_require__(3408);

            function _createSuper(Derived) {
                var hasNativeReflectConstruct = _isNativeReflectConstruct();
                return function _createSuperInternal() {
                    var Super = _getPrototypeOf(Derived),
                        result;
                    if (hasNativeReflectConstruct) {
                        var NewTarget = _getPrototypeOf(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else {
                        result = Super.apply(this, arguments);
                    }
                    return _possibleConstructorReturn(this, result);
                };
            }

            function _isNativeReflectConstruct() {
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

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.initNext = initNext;
            exports.render = render;
            exports.renderError = renderError;
            exports.emitter = exports.version = exports.router = void 0;

            __webpack_require__(5193);

            var _react = _interopRequireDefault(__webpack_require__(2735));

            var _reactDom = _interopRequireDefault(__webpack_require__(2788));

            var _headManagerContext = __webpack_require__(1874);

            var _mitt = _interopRequireDefault(__webpack_require__(4387));

            var _routerContext = __webpack_require__(6857);

            var _router = __webpack_require__(1073);

            var _isDynamic = __webpack_require__(2140);

            var _querystring = __webpack_require__(6136);

            var _runtimeConfig = __webpack_require__(3338);

            var _utils = __webpack_require__(6373);

            var _portal = __webpack_require__(3651);

            var _headManager = _interopRequireDefault(
                __webpack_require__(4424)
            );

            var _pageLoader = _interopRequireDefault(__webpack_require__(6042));

            var _performanceRelayer = _interopRequireDefault(
                __webpack_require__(8421)
            );

            var _routeAnnouncer = __webpack_require__(2450);

            var _router1 = __webpack_require__(6409);

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

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                } else {
                    var newObj = {};

                    if (obj != null) {
                        for (var key in obj) {
                            if (
                                Object.prototype.hasOwnProperty.call(obj, key)
                            ) {
                                var desc =
                                    Object.defineProperty &&
                                    Object.getOwnPropertyDescriptor
                                        ? Object.getOwnPropertyDescriptor(
                                              obj,
                                              key
                                          )
                                        : {};

                                if (desc.get || desc.set) {
                                    Object.defineProperty(newObj, key, desc);
                                } else {
                                    newObj[key] = obj[key];
                                }
                            }
                        }
                    }

                    newObj["default"] = obj;
                    return newObj;
                }
            }

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
                        _defineProperty(target, key, source[key]);
                    });
                }

                return target;
            }

            var data = JSON.parse(
                document.getElementById("__NEXT_DATA__").textContent
            );
            window.__NEXT_DATA__ = data;
            var version = "11.0.2-canary.24";
            exports.version = version;

            var looseToArray = function looseToArray(input) {
                return [].slice.call(input);
            };

            var hydrateProps = data.props,
                hydrateErr = data.err,
                page = data.page,
                query = data.query,
                buildId = data.buildId,
                assetPrefix = data.assetPrefix,
                runtimeConfig = data.runtimeConfig,
                dynamicIds = data.dynamicIds,
                isFallback = data.isFallback,
                locale = data.locale,
                locales = data.locales,
                domainLocales = data.domainLocales,
                isPreview = data.isPreview;
            var defaultLocale = data.defaultLocale;
            var prefix = assetPrefix || ""; // With dynamic assetPrefix it's no longer possible to set assetPrefix at the build time
            // So, this is how we do it in the client side at runtime

            __webpack_require__.p = "".concat(prefix, "/_next/"); //line // Initialize next/config with the environment configuration

            (0, _runtimeConfig).setConfig({
                serverRuntimeConfig: {},
                publicRuntimeConfig: runtimeConfig || {},
            });
            var asPath = (0, _utils).getURL(); // make sure not to attempt stripping basePath for 404s

            if ((0, _router).hasBasePath(asPath)) {
                asPath = (0, _router).delBasePath(asPath);
            }

            if (false) {
                var detectedDomain,
                    localePathResult,
                    parsedAs,
                    _require4,
                    formatUrl,
                    _require3,
                    parseRelativeUrl,
                    _require2,
                    detectDomainLocale,
                    _require,
                    normalizeLocalePath;
            }

            if (data.scriptLoader) {
                var _require5 = __webpack_require__(4843),
                    initScriptLoader = _require5.initScriptLoader;

                initScriptLoader(data.scriptLoader);
            }

            var pageLoader = new _pageLoader["default"](buildId, prefix);

            var register = function register(_ref) {
                var _ref2 = _slicedToArray(_ref, 2),
                    r = _ref2[0],
                    f = _ref2[1];

                return pageLoader.routeLoader.onEntrypoint(r, f);
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
            var headManager = (0, _headManager)["default"]();
            var appElement = document.getElementById("__next");

            var _lastRenderReject;

            var webpackHMR;
            var router;
            exports.router = router;
            var CachedApp, onPerfEntry;

            var Container = /*#__PURE__*/ (function (_react$default$Compon) {
                _inherits(Container, _react$default$Compon);

                var _super = _createSuper(Container);

                function Container() {
                    _classCallCheck(this, Container);

                    return _super.apply(this, arguments);
                }

                _createClass(Container, [
                    {
                        key: "componentDidCatch",
                        value: function componentDidCatch(componentErr, info) {
                            this.props.fn(componentErr, info);
                        },
                    },
                    {
                        key: "componentDidMount",
                        value: function componentDidMount() {
                            this.scrollToHash(); // We need to replace the router state if:
                            // - the page was (auto) exported and has a query string or search (hash)
                            // - it was auto exported and is a dynamic route (to provide params)
                            // - if it is a client-side skeleton (fallback render)

                            if (
                                router.isSsr && // We don't update for 404 requests as this can modify
                                // the asPath unexpectedly e.g. adding basePath when
                                // it wasn't originally present
                                page !== "/404" &&
                                !(
                                    page === "/_error" &&
                                    hydrateProps &&
                                    hydrateProps.pageProps &&
                                    hydrateProps.pageProps.statusCode === 404
                                ) &&
                                (isFallback ||
                                    (data.nextExport &&
                                        ((0, _isDynamic).isDynamicRoute(
                                            router.pathname
                                        ) ||
                                            location.search ||
                                            false)) ||
                                    (hydrateProps &&
                                        hydrateProps.__N_SSG &&
                                        (location.search || false)))
                            ) {
                                // update query on mount for exported pages
                                router.replace(
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
                                        shallow: !isFallback,
                                    }
                                );
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
                            var _location = location,
                                hash = _location.hash;
                            hash = hash && hash.substring(1);
                            if (!hash) return;
                            var el = document.getElementById(hash);
                            if (!el) return; // If we call scrollIntoView() in here without a setTimeout
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
                                var _require6, ReactDevOverlay;
                            }
                        },
                    },
                ]);

                return Container;
            })(_react["default"].Component);

            var emitter = (0, _mitt)["default"]();
            exports.emitter = emitter;
            var CachedComponent;

            function _initNext() {
                _initNext = _asyncToGenerator(
                    /*#__PURE__*/ _regeneratorRuntime.mark(function _callee() {
                        var opts,
                            initialErr,
                            appEntrypoint,
                            app,
                            mod,
                            pageEntrypoint,
                            _require7,
                            isValidElementType,
                            _require8,
                            getNodeError,
                            renderCtx,
                            _args = arguments;

                        return _regeneratorRuntime.wrap(
                            function _callee$(_context) {
                                while (1) {
                                    switch ((_context.prev = _context.next)) {
                                        case 0:
                                            opts =
                                                _args.length > 0 &&
                                                _args[0] !== undefined
                                                    ? _args[0]
                                                    : {};

                                            // This makes sure this specific lines are removed in production
                                            if (false) {
                                            }

                                            initialErr = hydrateErr;
                                            _context.prev = 3;
                                            _context.next = 6;
                                            return pageLoader.routeLoader.whenEntrypoint(
                                                "/_app"
                                            );

                                        case 6:
                                            appEntrypoint = _context.sent;

                                            if (!("error" in appEntrypoint)) {
                                                _context.next = 9;
                                                break;
                                            }

                                            throw appEntrypoint.error;

                                        case 9:
                                            (app = appEntrypoint.component),
                                                (mod = appEntrypoint.exports);
                                            CachedApp = app;

                                            if (mod && mod.reportWebVitals) {
                                                onPerfEntry =
                                                    function onPerfEntry(
                                                        _ref3
                                                    ) {
                                                        var id = _ref3.id,
                                                            name = _ref3.name,
                                                            startTime =
                                                                _ref3.startTime,
                                                            value = _ref3.value,
                                                            duration =
                                                                _ref3.duration,
                                                            entryType =
                                                                _ref3.entryType,
                                                            entries =
                                                                _ref3.entries;
                                                        // Combines timestamp with random number for unique ID
                                                        var uniqueID = ""
                                                            .concat(
                                                                Date.now(),
                                                                "-"
                                                            )
                                                            .concat(
                                                                Math.floor(
                                                                    Math.random() *
                                                                        (9000000000000 -
                                                                            1)
                                                                ) +
                                                                    1000000000000
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

                                                        mod.reportWebVitals({
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
                                                        });
                                                    };
                                            }

                                            if (true) {
                                                _context.next = 16;
                                                break;
                                            }

                                            _context.t0 = {
                                                error: hydrateErr,
                                            };
                                            _context.next = 19;
                                            break;

                                        case 16:
                                            _context.next = 18;
                                            return pageLoader.routeLoader.whenEntrypoint(
                                                page
                                            );

                                        case 18:
                                            _context.t0 = _context.sent;

                                        case 19:
                                            pageEntrypoint = _context.t0;

                                            if (!("error" in pageEntrypoint)) {
                                                _context.next = 22;
                                                break;
                                            }

                                            throw pageEntrypoint.error;

                                        case 22:
                                            CachedComponent =
                                                pageEntrypoint.component;

                                            if (true) {
                                                _context.next = 27;
                                                break;
                                            }

                                            (_require7 = __webpack_require__(
                                                Object(
                                                    (function webpackMissingModule() {
                                                        var e = new Error(
                                                            "Cannot find module 'react-is'"
                                                        );
                                                        e.code =
                                                            "MODULE_NOT_FOUND";
                                                        throw e;
                                                    })()
                                                )
                                            )),
                                                (isValidElementType =
                                                    _require7.isValidElementType);

                                            if (
                                                isValidElementType(
                                                    CachedComponent
                                                )
                                            ) {
                                                _context.next = 27;
                                                break;
                                            }

                                            throw new Error(
                                                'The default export is not a React Component in page: "'.concat(
                                                    page,
                                                    '"'
                                                )
                                            );

                                        case 27:
                                            _context.next = 32;
                                            break;

                                        case 29:
                                            _context.prev = 29;
                                            _context.t1 = _context["catch"](3);
                                            // This catches errors like throwing in the top level of a module
                                            initialErr = _context.t1;

                                        case 32:
                                            if (false) {
                                            }

                                            if (!window.__NEXT_PRELOADREADY) {
                                                _context.next = 36;
                                                break;
                                            }

                                            _context.next = 36;
                                            return window.__NEXT_PRELOADREADY(
                                                dynamicIds
                                            );

                                        case 36:
                                            exports.router = router = (0,
                                            _router1).createRouter(
                                                page,
                                                query,
                                                asPath,
                                                {
                                                    initialProps: hydrateProps,
                                                    pageLoader: pageLoader,
                                                    App: CachedApp,
                                                    Component: CachedComponent,
                                                    wrapApp: wrapApp,
                                                    err: initialErr,
                                                    isFallback:
                                                        Boolean(isFallback),
                                                    subscription:
                                                        function subscription(
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
                                                    locale: locale,
                                                    locales: locales,
                                                    defaultLocale:
                                                        defaultLocale,
                                                    domainLocales:
                                                        domainLocales,
                                                    isPreview: isPreview,
                                                }
                                            );
                                            renderCtx = {
                                                App: CachedApp,
                                                initial: true,
                                                Component: CachedComponent,
                                                props: hydrateProps,
                                                err: initialErr,
                                            };

                                            if (false) {
                                            }

                                            render(renderCtx);
                                            return _context.abrupt(
                                                "return",
                                                emitter
                                            );

                                        case 43:
                                            return _context.abrupt("return", {
                                                emitter: emitter,
                                                renderCtx: renderCtx,
                                            });

                                        case 44:
                                        case "end":
                                            return _context.stop();
                                    }
                                }
                            },
                            _callee,
                            null,
                            [[3, 29]]
                        );
                    })
                );
                return _initNext.apply(this, arguments);
            }

            function initNext() {
                return _initNext.apply(this, arguments);
            }

            function _render() {
                _render = _asyncToGenerator(
                    /*#__PURE__*/ _regeneratorRuntime.mark(function _callee2(
                        renderingProps
                    ) {
                        return _regeneratorRuntime.wrap(
                            function _callee2$(_context2) {
                                while (1) {
                                    switch ((_context2.prev = _context2.next)) {
                                        case 0:
                                            if (!renderingProps.err) {
                                                _context2.next = 4;
                                                break;
                                            }

                                            _context2.next = 3;
                                            return renderError(renderingProps);

                                        case 3:
                                            return _context2.abrupt("return");

                                        case 4:
                                            _context2.prev = 4;
                                            _context2.next = 7;
                                            return doRender(renderingProps);

                                        case 7:
                                            _context2.next = 16;
                                            break;

                                        case 9:
                                            _context2.prev = 9;
                                            _context2.t0 =
                                                _context2["catch"](4);

                                            if (!_context2.t0.cancelled) {
                                                _context2.next = 13;
                                                break;
                                            }

                                            throw _context2.t0;

                                        case 13:
                                            if (false) {
                                            }

                                            _context2.next = 16;
                                            return renderError(
                                                _objectSpread(
                                                    {},
                                                    renderingProps,
                                                    {
                                                        err: _context2.t0,
                                                    }
                                                )
                                            );

                                        case 16:
                                        case "end":
                                            return _context2.stop();
                                    }
                                }
                            },
                            _callee2,
                            null,
                            [[4, 9]]
                        );
                    })
                );
                return _render.apply(this, arguments);
            }

            function render(renderingProps) {
                return _render.apply(this, arguments);
            }

            function renderError(renderErrorProps) {
                var App = renderErrorProps.App,
                    err = renderErrorProps.err; // In development runtime errors are caught by our overlay
                // In production we catch runtime errors using componentDidCatch which will trigger renderError

                if (false) {
                } // Make sure we log the error to the console, otherwise users can't track down issues.

                console.error(err);
                return pageLoader
                    .loadPage("/_error")
                    .then(function (_ref4) {
                        var ErrorComponent = _ref4.page,
                            styleSheets = _ref4.styleSheets;
                        return (lastAppProps === null || lastAppProps === void 0
                            ? void 0
                            : lastAppProps.Component) === ErrorComponent
                            ? Promise.resolve()
                                  .then(function () {
                                      return _interopRequireWildcard(
                                          __webpack_require__(4956)
                                      );
                                  })
                                  .then(function (m) {
                                      return {
                                          ErrorComponent: m["default"],
                                          styleSheets: [],
                                      };
                                  })
                            : {
                                  ErrorComponent: ErrorComponent,
                                  styleSheets: styleSheets,
                              };
                    })
                    .then(function (_ref5) {
                        var ErrorComponent = _ref5.ErrorComponent,
                            styleSheets = _ref5.styleSheets;
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
                                pathname: page,
                                query: query,
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
                                _objectSpread({}, renderErrorProps, {
                                    err: err,
                                    Component: ErrorComponent,
                                    styleSheets: styleSheets,
                                    props: initProps,
                                })
                            );
                        });
                    });
            }

            var reactRoot = null; // On initial render a hydrate should always happen

            var shouldHydrate = true;

            function renderReactElement(domEl, fn) {
                // mark start of hydrate/render
                if (_utils.ST) {
                    performance.mark("beforeRender");
                }

                var reactEl = fn(
                    shouldHydrate ? markHydrateComplete : markRenderComplete
                );

                if (false) {
                } else {
                    // The check for `.hydrate` is there to support React alternatives like preact
                    if (shouldHydrate) {
                        _reactDom["default"].hydrate(reactEl, domEl);

                        shouldHydrate = false;
                    } else {
                        _reactDom["default"].render(reactEl, domEl);
                    }
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

            function AppContainer(_ref6) {
                var children = _ref6.children;
                return /*#__PURE__*/ _react["default"].createElement(
                    Container,
                    {
                        fn: function fn(error) {
                            return renderError({
                                App: CachedApp,
                                err: error,
                            })["catch"](function (err) {
                                return console.error(
                                    "Error rendering page: ",
                                    err
                                );
                            });
                        },
                    },
                    /*#__PURE__*/ _react["default"].createElement(
                        _routerContext.RouterContext.Provider,
                        {
                            value: (0, _router1).makePublicRouterInstance(
                                router
                            ),
                        },
                        /*#__PURE__*/ _react["default"].createElement(
                            _headManagerContext.HeadManagerContext.Provider,
                            {
                                value: headManager,
                            },
                            children
                        )
                    )
                );
            }

            var wrapApp = function wrapApp(App) {
                return function (wrappedAppProps) {
                    var appProps = _objectSpread({}, wrappedAppProps, {
                        Component: CachedComponent,
                        err: hydrateErr,
                        router: router,
                    });

                    return /*#__PURE__*/ _react["default"].createElement(
                        AppContainer,
                        null,
                        /*#__PURE__*/ _react["default"].createElement(
                            App,
                            Object.assign({}, appProps)
                        )
                    );
                };
            };

            var lastAppProps;

            function doRender(input) {
                var App = input.App,
                    Component = input.Component,
                    props = input.props,
                    err = input.err;
                var styleSheets =
                    "initial" in input ? undefined : input.styleSheets;
                Component = Component || lastAppProps.Component;
                props = props || lastAppProps.props;

                var appProps = _objectSpread({}, props, {
                    Component: Component,
                    err: err,
                    router: router,
                }); // lastAppProps has to be set before ReactDom.render to account for ReactDom throwing an error.

                lastAppProps = appProps;
                var canceled = false;
                var resolvePromise;
                var renderPromise = new Promise(function (resolve, reject) {
                    if (_lastRenderReject) {
                        _lastRenderReject();
                    }

                    resolvePromise = function resolvePromise() {
                        _lastRenderReject = null;
                        resolve();
                    };

                    _lastRenderReject = function lastRenderReject() {
                        canceled = true;
                        _lastRenderReject = null;
                        var error = new Error("Cancel rendering route");
                        error.cancelled = true;
                        reject(error);
                    };
                }); // This function has a return type to ensure it doesn't start returning a
                // Promise. It should remain synchronous.

                function onStart() {
                    if (
                        !styleSheets || // We use `style-loader` in development, so we don't need to do anything
                        // unless we're in production:
                        false
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
                        noscript === null || noscript === void 0
                            ? void 0
                            : noscript.getAttribute("data-n-css");
                    styleSheets.forEach(function (_ref7) {
                        var href = _ref7.href,
                            text = _ref7.text;

                        if (!currentHrefs.has(href)) {
                            var styleTag = document.createElement("style");
                            styleTag.setAttribute("data-n-href", href);
                            styleTag.setAttribute("media", "x");

                            if (nonce) {
                                styleTag.setAttribute("nonce", nonce);
                            }

                            document.head.appendChild(styleTag);
                            styleTag.appendChild(document.createTextNode(text));
                        }
                    });
                    return true;
                }

                function onHeadCommit() {
                    if (
                        // We use `style-loader` in development, so we don't need to do anything
                        // unless we're in production:
                        true && // We can skip this during hydration. Running it wont cause any harm, but
                        // we may as well save the CPU cycles:
                        styleSheets && // Ensure this render was not canceled
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
                        }); // Toggle `<style>` tags on or off depending on if they're needed:

                        for (var idx = 0; idx < currentHrefs.length; ++idx) {
                            if (desiredHrefs.has(currentHrefs[idx])) {
                                currentStyleTags[idx].removeAttribute("media");
                            } else {
                                currentStyleTags[idx].setAttribute(
                                    "media",
                                    "x"
                                );
                            }
                        } // Reorder styles into intended order:

                        var referenceNode = document.querySelector(
                            "noscript[data-n-css]"
                        );

                        if (
                            // This should be an invariant:
                            referenceNode
                        ) {
                            styleSheets.forEach(function (_ref8) {
                                var href = _ref8.href;
                                var targetTag = document.querySelector(
                                    'style[data-n-href="'.concat(href, '"]')
                                );

                                if (
                                    // This should be an invariant:
                                    targetTag
                                ) {
                                    referenceNode.parentNode.insertBefore(
                                        targetTag,
                                        referenceNode.nextSibling
                                    );
                                    referenceNode = targetTag;
                                }
                            });
                        } // Finally, clean up server rendered stylesheets:

                        looseToArray(
                            document.querySelectorAll("link[data-n-p]")
                        ).forEach(function (el) {
                            el.parentNode.removeChild(el);
                        }); // Force browser to recompute layout, which should prevent a flash of
                        // unstyled content:

                        getComputedStyle(document.body, "height");
                    }

                    if (input.scroll) {
                        window.scrollTo(input.scroll.x, input.scroll.y);
                    }
                }

                function onRootCommit() {
                    resolvePromise();
                }

                onStart();

                var elem = /*#__PURE__*/ _react["default"].createElement(
                    _react["default"].Fragment,
                    null,
                    /*#__PURE__*/ _react["default"].createElement(Head, {
                        callback: onHeadCommit,
                    }),
                    /*#__PURE__*/ _react["default"].createElement(
                        AppContainer,
                        null,
                        /*#__PURE__*/ _react["default"].createElement(
                            App,
                            Object.assign({}, appProps)
                        ),
                        /*#__PURE__*/ _react["default"].createElement(
                            _portal.Portal,
                            {
                                type: "next-route-announcer",
                            },
                            /*#__PURE__*/ _react["default"].createElement(
                                _routeAnnouncer.RouteAnnouncer,
                                null
                            )
                        )
                    )
                ); // We catch runtime errors using componentDidCatch which will trigger renderError

                renderReactElement(appElement, function (callback) {
                    return /*#__PURE__*/ _react["default"].createElement(
                        Root,
                        {
                            callbacks: [callback, onRootCommit],
                        },
                        false ? /*#__PURE__*/ 0 : elem
                    );
                });
                return renderPromise;
            }

            function Root(_ref9) {
                var callbacks = _ref9.callbacks,
                    children = _ref9.children;

                // We use `useLayoutEffect` to guarantee the callbacks are executed
                // as soon as React flushes the update
                _react["default"].useLayoutEffect(
                    function () {
                        return callbacks.forEach(function (callback) {
                            return callback();
                        });
                    },
                    [callbacks]
                );

                if (undefined) {
                    // next-line react-hooks/rules-of-hooks
                    _react["default"].useEffect(function () {
                        window.__NEXT_HYDRATED = true;

                        if (window.__NEXT_HYDRATED_CB) {
                            window.__NEXT_HYDRATED_CB();
                        }
                    }, []);
                } // We should ask to measure the Web Vitals after rendering completes so we
                // don't cause any hydration delay:

                _react["default"].useEffect(function () {
                    (0, _performanceRelayer)["default"](onPerfEntry);
                }, []);

                return children;
            } // Dummy component that we render as a child of Root so that we can
            // toggle the correct styles before the page is rendered.

            function Head(_ref10) {
                var callback = _ref10.callback;

                // We use `useLayoutEffect` to guarantee the callback is executed
                // as soon as React flushes the update.
                _react["default"].useLayoutEffect(
                    function () {
                        return callback();
                    },
                    [callback]
                );

                return null;
            }

            /***/
        },

        /***/ 5079: /***/ function (
            __unused_webpack_module,
            __unused_webpack_exports,
            __webpack_require__
        ) {
            "use strict";

            var _ = __webpack_require__(9201);

            window.next = {
                version: _.version,

                // router is initialized later so it has to be live-binded
                get router() {
                    return _.router;
                },

                emitter: _.emitter,
                render: _.render,
                renderError: _.renderError,
            };
            (0, _).initNext()["catch"](console.error);

            /***/
        },

        /***/ 3342: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.removePathTrailingSlash = removePathTrailingSlash;
            exports.normalizePathTrailingSlash = void 0;

            function removePathTrailingSlash(path) {
                return path.endsWith("/") && path !== "/"
                    ? path.slice(0, -1)
                    : path;
            }

            var normalizePathTrailingSlash = false
                ? 0
                : removePathTrailingSlash;
            exports.normalizePathTrailingSlash = normalizePathTrailingSlash;

            /***/
        },

        /***/ 6042: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _classCallCheck = __webpack_require__(4988);

            var _createClass = __webpack_require__(9590);

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.default = void 0;

            var _router = __webpack_require__(1073);

            var _getAssetPathFromRoute = _interopRequireDefault(
                __webpack_require__(3794)
            );

            var _isDynamic = __webpack_require__(2140);

            var _parseRelativeUrl = __webpack_require__(5284);

            var _normalizeTrailingSlash = __webpack_require__(3342);

            var _routeLoader = __webpack_require__(1740);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            function normalizeRoute(route) {
                if (route[0] !== "/") {
                    throw new Error(
                        'Route name should start with a "/", got "'.concat(
                            route,
                            '"'
                        )
                    );
                }

                if (route === "/") return route;
                return route.replace(/\/$/, "");
            }

            var PageLoader = /*#__PURE__*/ (function () {
                _createClass(PageLoader, [
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
                        /**
                         * @param {string} href the route href (file-system path)
                         * @param {string} asPath the URL as shown in browser (virtual path); used for dynamic routes
                         * @returns {string}
                         */
                    },
                    {
                        key: "getDataHref",
                        value: function getDataHref(href, asPath, ssg, locale) {
                            var _this = this;

                            var _parseRelativeUrl2 = (0,
                                _parseRelativeUrl).parseRelativeUrl(href),
                                hrefPathname = _parseRelativeUrl2.pathname,
                                query = _parseRelativeUrl2.query,
                                search = _parseRelativeUrl2.search;

                            var _parseRelativeUrl3 = (0,
                                _parseRelativeUrl).parseRelativeUrl(asPath),
                                asPathname = _parseRelativeUrl3.pathname;

                            var route = normalizeRoute(hrefPathname);

                            var getHrefForSlug = function getHrefForSlug(path) {
                                var dataRoute = (0, _getAssetPathFromRoute)[
                                    "default"
                                ](
                                    (0,
                                    _normalizeTrailingSlash).removePathTrailingSlash(
                                        (0, _router).addLocale(path, locale)
                                    ),
                                    ".json"
                                );
                                return (0, _router).addBasePath(
                                    "/_next/data/"
                                        .concat(_this.buildId)
                                        .concat(dataRoute)
                                        .concat(ssg ? "" : search)
                                );
                            };

                            var isDynamic = (0, _isDynamic).isDynamicRoute(
                                route
                            );
                            var interpolatedRoute = isDynamic
                                ? (0, _router).interpolateAs(
                                      hrefPathname,
                                      asPathname,
                                      query
                                  ).result
                                : "";
                            return isDynamic
                                ? interpolatedRoute &&
                                      getHrefForSlug(interpolatedRoute)
                                : getHrefForSlug(route);
                        },
                        /**
                         * @param {string} route - the route (file-system path)
                         */
                    },
                    {
                        key: "_isSsg",
                        value: function _isSsg(route) {
                            return this.promisedSsgManifest.then(function (s) {
                                return s.has(route);
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

                function PageLoader(buildId, assetPrefix) {
                    _classCallCheck(this, PageLoader);

                    this.routeLoader = (0, _routeLoader).createRouteLoader(
                        assetPrefix
                    );
                    this.buildId = buildId;
                    this.assetPrefix = assetPrefix;
                    /** @type {Promise<Set<string>>} */

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

                return PageLoader;
            })();

            exports.default = PageLoader;

            /***/
        },

        /***/ 8421: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.default = void 0;

            var _webVitals = __webpack_require__(5549);

            var initialHref = location.href;
            var isRegistered = false;
            var userReportHandler;

            function onReport(metric) {
                if (userReportHandler) {
                    userReportHandler(metric);
                } // This code is not shipped, executed, or present in the client-side
                // JavaScript bundle unless explicitly enabled in your application.
                //
                // When this feature is enabled, we'll make it very clear by printing a
                // message during the build (`next build`).

                if (false) {
                    var send, vitalsUrl, blob, body, fallbackSend;
                }
            }

            var _default = function _default(onPerfEntry) {
                // Update function if it changes:
                userReportHandler = onPerfEntry; // Only register listeners once:

                if (isRegistered) {
                    return;
                }

                isRegistered = true;
                (0, _webVitals).getCLS(onReport);
                (0, _webVitals).getFID(onReport);
                (0, _webVitals).getFCP(onReport);
                (0, _webVitals).getLCP(onReport);
                (0, _webVitals).getTTFB(onReport);
            };

            exports.default = _default;

            /***/
        },

        /***/ 3651: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _slicedToArray = __webpack_require__(3408);

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.Portal = void 0;

            var _react = _interopRequireDefault(__webpack_require__(2735));

            var _reactDom = __webpack_require__(2788);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            var Portal = function Portal(_ref) {
                var children = _ref.children,
                    type = _ref.type;

                var portalNode = _react["default"].useRef(null);

                var _react$default$useSta = _react["default"].useState(),
                    _react$default$useSta2 = _slicedToArray(
                        _react$default$useSta,
                        2
                    ),
                    forceUpdate = _react$default$useSta2[1];

                _react["default"].useEffect(
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

            /***/
        },

        /***/ 6933: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.requestIdleCallback = exports.cancelIdleCallback = void 0;

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

            /***/
        },

        /***/ 2450: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _slicedToArray = __webpack_require__(3408);

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.RouteAnnouncer = RouteAnnouncer;
            exports.default = void 0;

            var _react = _interopRequireDefault(__webpack_require__(2735));

            var _router = __webpack_require__(6409);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            function RouteAnnouncer() {
                var _useRouter = (0, _router).useRouter(),
                    asPath = _useRouter.asPath;

                var _react$default$useSta = _react["default"].useState(""),
                    _react$default$useSta2 = _slicedToArray(
                        _react$default$useSta,
                        2
                    ),
                    routeAnnouncement = _react$default$useSta2[0],
                    setRouteAnnouncement = _react$default$useSta2[1]; // Only announce the path change, but not for the first load because screen reader will do that automatically.

                var initialPathLoaded = _react["default"].useRef(false); // Every time the path changes, announce the route change. The announcement will be prioritized by h1, then title
                // (from metadata), and finally if those don't exist, then the pathName that is in the URL. This methodology is
                // inspired by Marcy Sutton's accessible client routing user testing. More information can be found here:
                // https://www.gatsbyjs.com/blog/2019-07-11-user-testing-accessible-client-routing/

                _react["default"].useEffect(
                    function () {
                        if (!initialPathLoaded.current) {
                            initialPathLoaded.current = true;
                            return;
                        }

                        var newRouteAnnouncement;
                        var pageHeader = document.querySelector("h1");

                        if (pageHeader) {
                            newRouteAnnouncement =
                                pageHeader.innerText || pageHeader.textContent;
                        }

                        if (!newRouteAnnouncement) {
                            if (document.title) {
                                newRouteAnnouncement = document.title;
                            } else {
                                newRouteAnnouncement = asPath;
                            }
                        }

                        setRouteAnnouncement(newRouteAnnouncement);
                    }, // TODO: switch to pathname + query object of dynamic route requirements
                    [asPath]
                );

                return /*#__PURE__*/ _react["default"].createElement(
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
            exports.default = _default;

            /***/
        },

        /***/ 1740: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.markAssetError = markAssetError;
            exports.isAssetError = isAssetError;
            exports.getClientBuildManifest = getClientBuildManifest;
            exports.createRouteLoader = createRouteLoader;

            var _getAssetPathFromRoute = _interopRequireDefault(
                __webpack_require__(3794)
            );

            var _requestIdleCallback = __webpack_require__(6933);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            } // 3.8s was arbitrarily chosen as it's what https://web.dev/interactive
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
                    ? generator().then(function (value) {
                          return resolver(value), value;
                      })
                    : prom;
            }

            function hasPrefetch(link) {
                try {
                    link = document.createElement("link");
                    return (
                        // detect IE11 since it supports prefetch but isn't detected
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
                    if (
                        document.querySelector(
                            'link[rel="prefetch"][href^="'.concat(href, '"]')
                        )
                    ) {
                        return res();
                    }

                    link = document.createElement("link"); // The order of property assignment here is intentional:

                    if (as) link.as = as;
                    link.rel = "prefetch";
                    link.crossOrigin = undefined;
                    link.onload = res;
                    link.onerror = rej; // `href` should always be last:

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
                    script = document.createElement("script"); // The order of property assignment here is intentional.
                    // 1. Setup success/failure hooks in case the browser synchronously
                    //    executes when `src` is set.

                    script.onload = resolve;

                    script.onerror = function () {
                        return reject(
                            markAssetError(
                                new Error("Failed to load script: ".concat(src))
                            )
                        );
                    }; // 2. Configure the cross-origin attribute before setting `src` in case the
                    //    browser begins to fetch.

                    script.crossOrigin = undefined; // 3. Finally, set the source and inject into the DOM in case the child
                    //    must be appended for fetching to start.

                    script.src = src;
                    document.body.appendChild(script);
                });
            } // We wait for pages to be built in dev before we start the route transition
            // timeout to prevent an un-necessary hard navigation in development.

            var devBuildPromise; // Resolve a promise that times out after given amount of milliseconds.

            function resolvePromiseWithTimeout(p, ms, err) {
                return new Promise(function (resolve, reject) {
                    var cancelled = false;
                    p.then(function (r) {
                        // Resolved, cancel the timeout
                        cancelled = true;
                        resolve(r);
                    })["catch"](reject); // We wrap these checks separately for better dead-code elimination in
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
                        scripts: allFiles.filter(function (v) {
                            return v.endsWith(".js");
                        }),
                        css: allFiles.filter(function (v) {
                            return v.endsWith(".css");
                        }),
                    };
                });
            }

            function createRouteLoader(assetPrefix) {
                var entrypoints = new Map();
                var loadedScripts = new Map();
                var styleSheets = new Map();
                var routes = new Map();

                function maybeExecuteScript(src) {
                    var prom = loadedScripts.get(src);

                    if (prom) {
                        return prom;
                    } // Skip executing script if it's already in the DOM:

                    if (
                        document.querySelector(
                            'script[src^="'.concat(src, '"]')
                        )
                    ) {
                        return Promise.resolve();
                    }

                    loadedScripts.set(src, (prom = appendScript(src)));
                    return prom;
                }

                function fetchStyleSheet(href) {
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
                            ["catch"](function (err) {
                                throw markAssetError(err);
                            }))
                    );
                    return prom;
                }

                return {
                    whenEntrypoint: function whenEntrypoint(route) {
                        return withFuture(route, entrypoints);
                    },
                    onEntrypoint: function onEntrypoint(route, execute) {
                        Promise.resolve(execute)
                            .then(function (fn) {
                                return fn();
                            })
                            .then(
                                function (exports) {
                                    return {
                                        component:
                                            (exports && exports["default"]) ||
                                            exports,
                                        exports: exports,
                                    };
                                },
                                function (err) {
                                    return {
                                        error: err,
                                    };
                                }
                            )
                            .then(function (input) {
                                var old = entrypoints.get(route);
                                entrypoints.set(route, input);
                                if (old && "resolve" in old) old.resolve(input);
                            });
                    },
                    loadRoute: function loadRoute(route, prefetch) {
                        var _this = this;

                        return withFuture(route, routes, function () {
                            var routeFilesPromise = getFilesForRoute(
                                assetPrefix,
                                route
                            )
                                .then(function (_ref) {
                                    var scripts = _ref.scripts,
                                        css = _ref.css;
                                    return Promise.all([
                                        entrypoints.has(route)
                                            ? []
                                            : Promise.all(
                                                  scripts.map(
                                                      maybeExecuteScript
                                                  )
                                              ),
                                        Promise.all(css.map(fetchStyleSheet)),
                                    ]);
                                })
                                .then(function (res) {
                                    return _this
                                        .whenEntrypoint(route)
                                        .then(function (entrypoint) {
                                            return {
                                                entrypoint: entrypoint,
                                                styles: res[1],
                                            };
                                        });
                                });

                            if (false) {
                            }

                            return resolvePromiseWithTimeout(
                                routeFilesPromise,
                                MS_MAX_IDLE_DELAY,
                                markAssetError(
                                    new Error(
                                        "Route did not complete loading: ".concat(
                                            route
                                        )
                                    )
                                )
                            )
                                .then(function (_ref2) {
                                    var entrypoint = _ref2.entrypoint,
                                        styles = _ref2.styles;
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
                                ["catch"](function (err) {
                                    if (prefetch) {
                                        // we don't want to cache errors during prefetch
                                        throw err;
                                    }

                                    return {
                                        error: err,
                                    };
                                });
                        });
                    },
                    prefetch: function prefetch(route) {
                        var _this2 = this;

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
                                                  script,
                                                  "script"
                                              );
                                          })
                                        : []
                                );
                            })
                            .then(function () {
                                (0, _requestIdleCallback).requestIdleCallback(
                                    function () {
                                        return _this2
                                            .loadRoute(route, true)
                                            ["catch"](function () {});
                                    }
                                );
                            })
                            ["catch"](
                                // swallow prefetch errors
                                function () {}
                            );
                    },
                };
            }

            /***/
        },

        /***/ 6409: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _construct = __webpack_require__(4096);

            function _createForOfIteratorHelper(o, allowArrayLike) {
                var it;
                if (
                    typeof Symbol === "undefined" ||
                    o[Symbol.iterator] == null
                ) {
                    if (
                        Array.isArray(o) ||
                        (it = _unsupportedIterableToArray(o)) ||
                        (allowArrayLike && o && typeof o.length === "number")
                    ) {
                        if (it) o = it;
                        var i = 0;
                        var F = function F() {};
                        return {
                            s: F,
                            n: function n() {
                                if (i >= o.length)
                                    return {
                                        done: true,
                                    };
                                return {
                                    done: false,
                                    value: o[i++],
                                };
                            },
                            e: function e(_e) {
                                throw _e;
                            },
                            f: F,
                        };
                    }
                    throw new TypeError(
                        "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
                    );
                }
                var normalCompletion = true,
                    didErr = false,
                    err;
                return {
                    s: function s() {
                        it = o[Symbol.iterator]();
                    },
                    n: function n() {
                        var step = it.next();
                        normalCompletion = step.done;
                        return step;
                    },
                    e: function e(_e2) {
                        didErr = true;
                        err = _e2;
                    },
                    f: function f() {
                        try {
                            if (!normalCompletion && it["return"] != null)
                                it["return"]();
                        } finally {
                            if (didErr) throw err;
                        }
                    },
                };
            }

            function _unsupportedIterableToArray(o, minLen) {
                if (!o) return;
                if (typeof o === "string") return _arrayLikeToArray(o, minLen);
                var n = Object.prototype.toString.call(o).slice(8, -1);
                if (n === "Object" && o.constructor) n = o.constructor.name;
                if (n === "Map" || n === "Set") return Array.from(o);
                if (
                    n === "Arguments" ||
                    /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                )
                    return _arrayLikeToArray(o, minLen);
            }

            function _arrayLikeToArray(arr, len) {
                if (len == null || len > arr.length) len = arr.length;
                for (var i = 0, arr2 = new Array(len); i < len; i++) {
                    arr2[i] = arr[i];
                }
                return arr2;
            }

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            Object.defineProperty(exports, "Router", {
                enumerable: true,
                get: function get() {
                    return _router["default"];
                },
            });
            Object.defineProperty(exports, "withRouter", {
                enumerable: true,
                get: function get() {
                    return _withRouter["default"];
                },
            });
            exports.useRouter = useRouter;
            exports.createRouter = createRouter;
            exports.makePublicRouterInstance = makePublicRouterInstance;
            exports.default = void 0;

            var _react = _interopRequireDefault(__webpack_require__(2735));

            var _router = _interopRequireDefault(__webpack_require__(1073));

            var _routerContext = __webpack_require__(6857);

            var _withRouter = _interopRequireDefault(__webpack_require__(9336));

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
            }; // Create public properties and methods of the router in the singletonRouter

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
            ]; // Events is a static property on the router, the router doesn't have to be initialized to use it

            Object.defineProperty(singletonRouter, "events", {
                get: function get() {
                    return _router["default"].events;
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
                    var router = getRouter();
                    return router[field].apply(router, arguments);
                };
            });
            routerEvents.forEach(function (event) {
                singletonRouter.ready(function () {
                    _router["default"].events.on(event, function () {
                        var eventField = "on"
                            .concat(event.charAt(0).toUpperCase())
                            .concat(event.substring(1));
                        var _singletonRouter = singletonRouter;

                        if (_singletonRouter[eventField]) {
                            try {
                                _singletonRouter[eventField].apply(
                                    _singletonRouter,
                                    arguments
                                );
                            } catch (err) {
                                console.error(
                                    "Error when running the Router event: ".concat(
                                        eventField
                                    )
                                );
                                console.error(
                                    ""
                                        .concat(err.message, "\n")
                                        .concat(err.stack)
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
            exports.default = _default;

            function useRouter() {
                return _react["default"].useContext(
                    _routerContext.RouterContext
                );
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

                singletonRouter.router = _construct(_router["default"], args);
                singletonRouter.readyCallbacks.forEach(function (cb) {
                    return cb();
                });
                singletonRouter.readyCallbacks = [];
                return singletonRouter.router;
            }

            function makePublicRouterInstance(router) {
                var _router1 = router;
                var instance = {};

                var _iterator = _createForOfIteratorHelper(urlPropertyFields),
                    _step;

                try {
                    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                        var property = _step.value;

                        if (typeof _router1[property] === "object") {
                            instance[property] = Object.assign(
                                Array.isArray(_router1[property]) ? [] : {},
                                _router1[property]
                            ); // makes sure query is not stateful
                            continue;
                        }

                        instance[property] = _router1[property];
                    } // Events is a static property on the router, the router doesn't have to be initialized to use it
                } catch (err) {
                    _iterator.e(err);
                } finally {
                    _iterator.f();
                }

                instance.events = _router["default"].events;
                coreMethodFields.forEach(function (field) {
                    instance[field] = function () {
                        return _router1[field].apply(_router1, arguments);
                    };
                });
                return instance;
            }

            /***/
        },

        /***/ 4843: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _slicedToArray = __webpack_require__(3408);

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.initScriptLoader = initScriptLoader;
            exports.default = void 0;

            var _react = __webpack_require__(2735);

            var _headManagerContext = __webpack_require__(1874);

            var _headManager = __webpack_require__(4424);

            var _requestIdleCallback = __webpack_require__(6933);

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

                    for (i = 0; i < sourceSymbolKeys.length; i++) {
                        key = sourceSymbolKeys[i];
                        if (excluded.indexOf(key) >= 0) continue;
                        if (
                            !Object.prototype.propertyIsEnumerable.call(
                                source,
                                key
                            )
                        )
                            continue;
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

            var loadScript = function loadScript(props) {
                var src = props.src,
                    id = props.id,
                    _props$onLoad = props.onLoad,
                    onLoad =
                        _props$onLoad === void 0
                            ? function () {}
                            : _props$onLoad,
                    dangerouslySetInnerHTML = props.dangerouslySetInnerHTML,
                    _props$children = props.children,
                    children =
                        _props$children === void 0 ? "" : _props$children,
                    onError = props.onError;
                var cacheKey = id || src; // Script has already loaded

                if (cacheKey && LoadCache.has(cacheKey)) {
                    return;
                } // Contents of this script are already loading/loaded

                if (ScriptCache.has(src)) {
                    LoadCache.add(cacheKey); // Execute onLoad since the script loading has begun

                    ScriptCache.get(src).then(onLoad, onError);
                    return;
                }

                var el = document.createElement("script");
                var loadPromise = new Promise(function (resolve, reject) {
                    el.addEventListener("load", function () {
                        resolve();

                        if (onLoad) {
                            onLoad.call(this);
                        }
                    });
                    el.addEventListener("error", function () {
                        reject();

                        if (onError) {
                            onError();
                        }
                    });
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

                for (
                    var _i = 0, _Object$entries = Object.entries(props);
                    _i < _Object$entries.length;
                    _i++
                ) {
                    var _Object$entries$_i = _slicedToArray(
                            _Object$entries[_i],
                            2
                        ),
                        k = _Object$entries$_i[0],
                        value = _Object$entries$_i[1];

                    if (value === undefined || ignoreProps.includes(k)) {
                        continue;
                    }

                    var attr =
                        _headManager.DOMAttributeNames[k] || k.toLowerCase();
                    el.setAttribute(attr, value);
                }

                document.body.appendChild(el);
            };

            function handleClientScriptLoad(props) {
                var _props$strategy = props.strategy,
                    strategy =
                        _props$strategy === void 0
                            ? "afterInteractive"
                            : _props$strategy;

                if (strategy === "afterInteractive") {
                    loadScript(props);
                } else if (strategy === "lazyOnload") {
                    window.addEventListener("load", function () {
                        (0, _requestIdleCallback).requestIdleCallback(
                            function () {
                                return loadScript(props);
                            }
                        );
                    });
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

            function initScriptLoader(scriptLoaderItems) {
                scriptLoaderItems.forEach(handleClientScriptLoad);
            }

            function Script(props) {
                var _props$src = props.src,
                    src = _props$src === void 0 ? "" : _props$src,
                    _props$onLoad2 = props.onLoad,
                    onLoad =
                        _props$onLoad2 === void 0
                            ? function () {}
                            : _props$onLoad2,
                    dangerouslySetInnerHTML = props.dangerouslySetInnerHTML,
                    _props$strategy2 = props.strategy,
                    strategy =
                        _props$strategy2 === void 0
                            ? "afterInteractive"
                            : _props$strategy2,
                    onError = props.onError,
                    restProps = _objectWithoutProperties(props, [
                        "src",
                        "onLoad",
                        "dangerouslySetInnerHTML",
                        "strategy",
                        "onError",
                    ]); // Context is available only during SSR

                var _useContext = (0, _react).useContext(
                        _headManagerContext.HeadManagerContext
                    ),
                    updateScripts = _useContext.updateScripts,
                    scripts = _useContext.scripts;

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

                if (strategy === "beforeInteractive") {
                    if (updateScripts) {
                        scripts.beforeInteractive = (
                            scripts.beforeInteractive || []
                        ).concat([
                            _objectSpread(
                                {
                                    src: src,
                                    onLoad: onLoad,
                                    onError: onError,
                                },
                                restProps
                            ),
                        ]);
                        updateScripts(scripts);
                    } else {
                        loadScript(props);
                    }
                }

                return null;
            }

            var _default = Script;
            exports.default = _default;

            /***/
        },

        /***/ 9336: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.default = withRouter;

            var _react = _interopRequireDefault(__webpack_require__(2735));

            var _router = __webpack_require__(6409);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            function withRouter(ComposedComponent) {
                function WithRouterWrapper(props) {
                    return /*#__PURE__*/ _react["default"].createElement(
                        ComposedComponent,
                        Object.assign(
                            {
                                router: (0, _router).useRouter(),
                            },
                            props
                        )
                    );
                }

                WithRouterWrapper.getInitialProps =
                    ComposedComponent.getInitialProps;
                WithRouterWrapper.origGetInitialProps =
                    ComposedComponent.origGetInitialProps;

                if (false) {
                    var name;
                }

                return WithRouterWrapper;
            }

            /***/
        },

        /***/ 4956: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _classCallCheck = __webpack_require__(4988);

            var _createClass = __webpack_require__(9590);

            var _inherits = __webpack_require__(4546);

            var _possibleConstructorReturn = __webpack_require__(1581);

            var _getPrototypeOf = __webpack_require__(852);

            function _createSuper(Derived) {
                var hasNativeReflectConstruct = _isNativeReflectConstruct();
                return function _createSuperInternal() {
                    var Super = _getPrototypeOf(Derived),
                        result;
                    if (hasNativeReflectConstruct) {
                        var NewTarget = _getPrototypeOf(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else {
                        result = Super.apply(this, arguments);
                    }
                    return _possibleConstructorReturn(this, result);
                };
            }

            function _isNativeReflectConstruct() {
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

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.default = void 0;

            var _react = _interopRequireDefault(__webpack_require__(2735));

            var _head = _interopRequireDefault(__webpack_require__(3396));

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

            function _getInitialProps(_ref) {
                var res = _ref.res,
                    err = _ref.err;
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

            var Error1 = /*#__PURE__*/ (function (_react$default$Compon) {
                _inherits(Error1, _react$default$Compon);

                var _super = _createSuper(Error1);

                function Error1() {
                    _classCallCheck(this, Error1);

                    return _super.apply(this, arguments);
                }

                _createClass(Error1, [
                    {
                        key: "render",
                        value: function render() {
                            var statusCode = this.props.statusCode;
                            var title =
                                this.props.title ||
                                statusCodes[statusCode] ||
                                "An unexpected error has occurred";
                            return /*#__PURE__*/ _react[
                                "default"
                            ].createElement(
                                "div",
                                {
                                    style: styles.error,
                                },
                                /*#__PURE__*/ _react["default"].createElement(
                                    _head["default"],
                                    null,
                                    /*#__PURE__*/ _react[
                                        "default"
                                    ].createElement(
                                        "title",
                                        null,
                                        statusCode
                                            ? ""
                                                  .concat(statusCode, ": ")
                                                  .concat(title)
                                            : "Application error: a client-side exception has occurred"
                                    )
                                ),
                                /*#__PURE__*/ _react["default"].createElement(
                                    "div",
                                    null,
                                    /*#__PURE__*/ _react[
                                        "default"
                                    ].createElement("style", {
                                        dangerouslySetInnerHTML: {
                                            __html: "body { margin: 0 }",
                                        },
                                    }),
                                    statusCode
                                        ? /*#__PURE__*/ _react[
                                              "default"
                                          ].createElement(
                                              "h1",
                                              {
                                                  style: styles.h1,
                                              },
                                              statusCode
                                          )
                                        : null,
                                    /*#__PURE__*/ _react[
                                        "default"
                                    ].createElement(
                                        "div",
                                        {
                                            style: styles.desc,
                                        },
                                        /*#__PURE__*/ _react[
                                            "default"
                                        ].createElement(
                                            "h2",
                                            {
                                                style: styles.h2,
                                            },
                                            this.props.title || statusCode
                                                ? title
                                                : /*#__PURE__*/ _react[
                                                      "default"
                                                  ].createElement(
                                                      _react["default"]
                                                          .Fragment,
                                                      null,
                                                      "Application error: a client-side exception has occurred (",
                                                      /*#__PURE__*/ _react[
                                                          "default"
                                                      ].createElement(
                                                          "a",
                                                          {
                                                              href: "https://nextjs.org/docs/messages/client-side-exception-occurred",
                                                          },
                                                          "developer guidance"
                                                      ),
                                                      ")"
                                                  ),
                                            "."
                                        )
                                    )
                                )
                            );
                        },
                    },
                ]);

                return Error1;
            })(_react["default"].Component);

            Error1.displayName = "ErrorPage";
            Error1.getInitialProps = _getInitialProps;
            Error1.origGetInitialProps = _getInitialProps;
            exports.default = Error1;
            var styles = {
                error: {
                    color: "#000",
                    background: "#fff",
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
                    borderRight: "1px solid rgba(0, 0, 0,.3)",
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

            /***/
        },

        /***/ 1923: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.AmpStateContext = void 0;

            var _react = _interopRequireDefault(__webpack_require__(2735));

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            var AmpStateContext = _react["default"].createContext({});

            exports.AmpStateContext = AmpStateContext;

            if (false) {
            }

            /***/
        },

        /***/ 5726: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.isInAmpMode = isInAmpMode;
            exports.useAmp = useAmp;

            var _react = _interopRequireDefault(__webpack_require__(2735));

            var _ampContext = __webpack_require__(1923);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            function isInAmpMode() {
                var _ref =
                        arguments.length > 0 && arguments[0] !== undefined
                            ? arguments[0]
                            : {},
                    _ref$ampFirst = _ref.ampFirst,
                    ampFirst = _ref$ampFirst === void 0 ? false : _ref$ampFirst,
                    _ref$hybrid = _ref.hybrid,
                    hybrid = _ref$hybrid === void 0 ? false : _ref$hybrid,
                    _ref$hasQuery = _ref.hasQuery,
                    hasQuery = _ref$hasQuery === void 0 ? false : _ref$hasQuery;

                return ampFirst || (hybrid && hasQuery);
            }

            function useAmp() {
                // Don't assign the context value to a variable to save bytes
                return isInAmpMode(
                    _react["default"].useContext(_ampContext.AmpStateContext)
                );
            }

            /***/
        },

        /***/ 1874: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.HeadManagerContext = void 0;

            var _react = _interopRequireDefault(__webpack_require__(2735));

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            var HeadManagerContext = _react["default"].createContext({});

            exports.HeadManagerContext = HeadManagerContext;

            if (false) {
            }

            /***/
        },

        /***/ 3396: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _defineProperty = __webpack_require__(566);

            function ownKeys(object, enumerableOnly) {
                var keys = Object.keys(object);
                if (Object.getOwnPropertySymbols) {
                    var symbols = Object.getOwnPropertySymbols(object);
                    if (enumerableOnly)
                        symbols = symbols.filter(function (sym) {
                            return Object.getOwnPropertyDescriptor(
                                object,
                                sym
                            ).enumerable;
                        });
                    keys.push.apply(keys, symbols);
                }
                return keys;
            }

            function _objectSpread(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i] != null ? arguments[i] : {};
                    if (i % 2) {
                        ownKeys(Object(source), true).forEach(function (key) {
                            _defineProperty(target, key, source[key]);
                        });
                    } else if (Object.getOwnPropertyDescriptors) {
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
                }
                return target;
            }

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.defaultHead = defaultHead;
            exports.default = void 0;

            var _react = _interopRequireWildcard(__webpack_require__(2735));

            var _sideEffect = _interopRequireDefault(__webpack_require__(2097));

            var _ampContext = __webpack_require__(1923);

            var _headManagerContext = __webpack_require__(1874);

            var _amp = __webpack_require__(5726);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                } else {
                    var newObj = {};

                    if (obj != null) {
                        for (var key in obj) {
                            if (
                                Object.prototype.hasOwnProperty.call(obj, key)
                            ) {
                                var desc =
                                    Object.defineProperty &&
                                    Object.getOwnPropertyDescriptor
                                        ? Object.getOwnPropertyDescriptor(
                                              obj,
                                              key
                                          )
                                        : {};

                                if (desc.get || desc.set) {
                                    Object.defineProperty(newObj, key, desc);
                                } else {
                                    newObj[key] = obj[key];
                                }
                            }
                        }
                    }

                    newObj["default"] = obj;
                    return newObj;
                }
            }

            function defaultHead() {
                var inAmpMode =
                    arguments.length > 0 && arguments[0] !== undefined
                        ? arguments[0]
                        : false;
                var head = [
                    /*#__PURE__*/ _react["default"].createElement("meta", {
                        charSet: "utf-8",
                    }),
                ];

                if (!inAmpMode) {
                    head.push(
                        /*#__PURE__*/ _react["default"].createElement("meta", {
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
                } // Adds support for React.Fragment

                if (child.type === _react["default"].Fragment) {
                    return list.concat(
                        _react["default"].Children.toArray(
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
*/

            function unique() {
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
                    } // next-line default-case

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
             * @param headElements List of multiple <Head> instances
             */

            function reduceComponents(headElements, props) {
                return headElements
                    .reduce(function (list, headElement) {
                        var headElementChildren = _react[
                            "default"
                        ].Children.toArray(headElement.props.children);

                        return list.concat(headElementChildren);
                    }, [])
                    .reduce(onlyReactElement, [])
                    .reverse()
                    .concat(defaultHead(props.inAmpMode))
                    .filter(unique())
                    .reverse()
                    .map(function (c, i) {
                        var key = c.key || i;

                        if (true && !props.inAmpMode) {
                            if (
                                c.type === "link" &&
                                c.props["href"] && // TODO(prateekbh@): Replace this with const from `constants` when the tree shaking works.
                                [
                                    "https://fonts.googleapis.com/css",
                                    "https://use.typekit.net/",
                                ].some(function (url) {
                                    return c.props["href"].startsWith(url);
                                })
                            ) {
                                var newProps = _objectSpread({}, c.props || {});

                                newProps["data-href"] = newProps["href"];
                                newProps["href"] = undefined; // Add this attribute to make it easy to identify optimized tags

                                newProps["data-optimized-fonts"] = true;
                                return /*#__PURE__*/ _react[
                                    "default"
                                ].cloneElement(c, newProps);
                            }
                        }

                        return /*#__PURE__*/ _react["default"].cloneElement(c, {
                            key: key,
                        });
                    });
            }
            /**
             * This component injects elements to `<head>` of your page.
             * To avoid duplicated `tags` in `<head>` you can use the `key` property, which will make sure every tag is only rendered once.
             */

            function Head(_ref) {
                var children = _ref.children;
                var ampState = (0, _react).useContext(
                    _ampContext.AmpStateContext
                );
                var headManager = (0, _react).useContext(
                    _headManagerContext.HeadManagerContext
                );
                return /*#__PURE__*/ _react["default"].createElement(
                    _sideEffect["default"],
                    {
                        reduceComponentsToState: reduceComponents,
                        headManager: headManager,
                        inAmpMode: (0, _amp).isInAmpMode(ampState),
                    },
                    children
                );
            }

            var _default = Head;
            exports.default = _default;

            /***/
        },

        /***/ 6509: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.normalizeLocalePath = normalizeLocalePath;

            function normalizeLocalePath(pathname, locales) {
                var detectedLocale; // first item will be empty string from splitting at first char

                var pathnameParts = pathname.split("/");
                (locales || []).some(function (locale) {
                    if (
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
            }

            /***/
        },

        /***/ 4387: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.default = mitt;

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
                            handler.apply(void 0, evts);
                        });
                    },
                };
            }

            /***/
        },

        /***/ 6857: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.RouterContext = void 0;

            var _react = _interopRequireDefault(__webpack_require__(2735));

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            var RouterContext = _react["default"].createContext(null);

            exports.RouterContext = RouterContext;

            if (false) {
            }

            /***/
        },

        /***/ 1073: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _regeneratorRuntime = __webpack_require__(7945);

            var _asyncToGenerator = __webpack_require__(5374);

            var _classCallCheck = __webpack_require__(4988);

            var _createClass = __webpack_require__(9590);

            var _slicedToArray = __webpack_require__(3408);

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.getDomainLocale = getDomainLocale;
            exports.addLocale = addLocale;
            exports.delLocale = delLocale;
            exports.hasBasePath = hasBasePath;
            exports.addBasePath = addBasePath;
            exports.delBasePath = delBasePath;
            exports.isLocalURL = isLocalURL;
            exports.interpolateAs = interpolateAs;
            exports.resolveHref = resolveHref;
            exports.default = void 0;

            var _normalizeTrailingSlash = __webpack_require__(3342);

            var _routeLoader = __webpack_require__(1740);

            var _denormalizePagePath = __webpack_require__(709);

            var _normalizeLocalePath = __webpack_require__(6509);

            var _mitt = _interopRequireDefault(__webpack_require__(4387));

            var _utils = __webpack_require__(6373);

            var _isDynamic = __webpack_require__(2140);

            var _parseRelativeUrl = __webpack_require__(5284);

            var _querystring = __webpack_require__(6136);

            var _resolveRewrites = _interopRequireDefault(
                __webpack_require__(808)
            );

            var _routeMatcher = __webpack_require__(2106);

            var _routeRegex = __webpack_require__(4339);

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule
                    ? obj
                    : {
                          default: obj,
                      };
            }

            var detectDomainLocale;

            if (false) {
            }

            var basePath = false || "";

            function buildCancellationError() {
                return Object.assign(new Error("Route Cancelled"), {
                    cancelled: true,
                });
            }

            function addPathPrefix(path, prefix) {
                return prefix && path.startsWith("/")
                    ? path === "/"
                        ? (0,
                          _normalizeTrailingSlash).normalizePathTrailingSlash(
                              prefix
                          )
                        : ""
                              .concat(prefix)
                              .concat(
                                  pathNoQueryHash(path) === "/"
                                      ? path.substring(1)
                                      : path
                              )
                    : path;
            }

            function getDomainLocale(path, locale, locales, domainLocales) {
                if (false) {
                    var detectedDomain;
                }

                return false;
            }

            function addLocale(path, locale, defaultLocale) {
                if (false) {
                    var localeLower, pathLower, pathname;
                }

                return path;
            }

            function delLocale(path, locale) {
                if (false) {
                    var localeLower, pathLower, pathname;
                }

                return path;
            }

            function pathNoQueryHash(path) {
                var queryIndex = path.indexOf("?");
                var hashIndex = path.indexOf("#");

                if (queryIndex > -1 || hashIndex > -1) {
                    path = path.substring(
                        0,
                        queryIndex > -1 ? queryIndex : hashIndex
                    );
                }

                return path;
            }

            function hasBasePath(path) {
                path = pathNoQueryHash(path);
                return path === basePath || path.startsWith(basePath + "/");
            }

            function addBasePath(path) {
                // we only add the basepath on relative urls
                return addPathPrefix(path, basePath);
            }

            function delBasePath(path) {
                path = path.slice(basePath.length);
                if (!path.startsWith("/")) path = "/".concat(path);
                return path;
            }

            function isLocalURL(url) {
                // prevent a hydration mismatch on href for url with anchor refs
                if (
                    url.startsWith("/") ||
                    url.startsWith("#") ||
                    url.startsWith("?")
                )
                    return true;

                try {
                    // absolute urls can be local if they are on the same origin
                    var locationOrigin = (0, _utils).getLocationOrigin();
                    var resolved = new URL(url, locationOrigin);
                    return (
                        resolved.origin === locationOrigin &&
                        hasBasePath(resolved.pathname)
                    );
                } catch (_) {
                    return false;
                }
            }

            function interpolateAs(route, asPathname, query) {
                var interpolatedRoute = "";
                var dynamicRegex = (0, _routeRegex).getRouteRegex(route);
                var dynamicGroups = dynamicRegex.groups;
                var dynamicMatches = // Try to match the dynamic route against the asPath
                    (asPathname !== route
                        ? (0, _routeMatcher).getRouteMatcher(dynamicRegex)(
                              asPathname
                          )
                        : "") || // Fall back to reading the values from the href
                    // TODO: should this take priority; also need to change in the router.
                    query;
                interpolatedRoute = route;
                var params = Object.keys(dynamicGroups);

                if (
                    !params.every(function (param) {
                        var value = dynamicMatches[param] || "";
                        var _dynamicGroups$param = dynamicGroups[param],
                            repeat = _dynamicGroups$param.repeat,
                            optional = _dynamicGroups$param.optional; // support single-level catch-all
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
                            (optional || param in dynamicMatches) && // Interpolate group into data URL if present
                            (interpolatedRoute =
                                interpolatedRoute.replace(
                                    replaced,
                                    repeat
                                        ? value
                                              .map(
                                                  // these values should be fully encoded instead of just
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
                    interpolatedRoute = ""; // did not satisfy all requirements // n.b. We ignore this error because we handle warning for this case in
                    // development in the `<Link>` component directly.
                }

                return {
                    params: params,
                    result: interpolatedRoute,
                };
            }

            function omitParmsFromQuery(query, params) {
                var filteredQuery = {};
                Object.keys(query).forEach(function (key) {
                    if (!params.includes(key)) {
                        filteredQuery[key] = query[key];
                    }
                });
                return filteredQuery;
            }

            function resolveHref(router, href, resolveAs) {
                // we use a dummy base url for relative urls
                var base;
                var urlAsString =
                    typeof href === "string"
                        ? href
                        : (0, _utils).formatWithValidation(href);

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
                } // Return because it cannot be routed by the Next.js router

                if (!isLocalURL(urlAsString)) {
                    return resolveAs ? [urlAsString] : urlAsString;
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

                        var _interpolateAs = interpolateAs(
                                finalUrl.pathname,
                                finalUrl.pathname,
                                query
                            ),
                            result = _interpolateAs.result,
                            params = _interpolateAs.params;

                        if (result) {
                            interpolatedAs = (0, _utils).formatWithValidation({
                                pathname: result,
                                hash: finalUrl.hash,
                                query: omitParmsFromQuery(query, params),
                            });
                        }
                    } // if the origin didn't change, it means we received a relative href

                    var resolvedHref =
                        finalUrl.origin === base.origin
                            ? finalUrl.href.slice(finalUrl.origin.length)
                            : finalUrl.href;
                    return resolveAs
                        ? [resolvedHref, interpolatedAs || resolvedHref]
                        : resolvedHref;
                } catch (_) {
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
                var _resolveHref = resolveHref(router, url, true),
                    _resolveHref2 = _slicedToArray(_resolveHref, 2),
                    resolvedHref = _resolveHref2[0],
                    resolvedAs = _resolveHref2[1];

                var origin = (0, _utils).getLocationOrigin();
                var hrefHadOrigin = resolvedHref.startsWith(origin);
                var asHadOrigin = resolvedAs && resolvedAs.startsWith(origin);
                resolvedHref = stripOrigin(resolvedHref);
                resolvedAs = resolvedAs ? stripOrigin(resolvedAs) : resolvedAs;
                var preparedUrl = hrefHadOrigin
                    ? resolvedHref
                    : addBasePath(resolvedHref);
                var preparedAs = as
                    ? stripOrigin(resolveHref(router, as))
                    : resolvedAs || resolvedHref;
                return {
                    url: preparedUrl,
                    as: asHadOrigin ? preparedAs : addBasePath(preparedAs),
                };
            }

            function resolveDynamicRoute(pathname, pages) {
                var cleanPathname = (0,
                _normalizeTrailingSlash).removePathTrailingSlash(
                    (0, _denormalizePagePath).denormalizePagePath(pathname)
                );

                if (cleanPathname === "/404" || cleanPathname === "/_error") {
                    return pathname;
                } // handle resolving href for dynamic routes

                if (!pages.includes(cleanPathname)) {
                    // next-line array-callback-return
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

                return (0, _normalizeTrailingSlash).removePathTrailingSlash(
                    pathname
                );
            }

            var manualScrollRestoration =
                /* unused pure expression or super */ null && false && 0;
            var SSG_DATA_NOT_FOUND = Symbol("SSG_DATA_NOT_FOUND");

            function fetchRetry(url, attempts) {
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
                }).then(function (res) {
                    if (!res.ok) {
                        if (attempts > 1 && res.status >= 500) {
                            return fetchRetry(url, attempts - 1);
                        }

                        if (res.status === 404) {
                            return res.json().then(function (data) {
                                if (data.notFound) {
                                    return {
                                        notFound: SSG_DATA_NOT_FOUND,
                                    };
                                }

                                throw new Error("Failed to load static props");
                            });
                        }

                        throw new Error("Failed to load static props");
                    }

                    return res.json();
                });
            }

            function fetchNextData(dataHref, isServerRender) {
                return fetchRetry(dataHref, isServerRender ? 3 : 1)["catch"](
                    function (err) {
                        // We should only trigger a server-side transition if this was caused
                        // on a client-side transition. Otherwise, we'd get into an infinite
                        // loop.
                        if (!isServerRender) {
                            (0, _routeLoader).markAssetError(err);
                        }

                        throw err;
                    }
                );
            }

            var Router = /*#__PURE__*/ (function () {
                function Router(pathname1, query1, as1, _ref) {
                    var _this = this;

                    var initialProps = _ref.initialProps,
                        pageLoader = _ref.pageLoader,
                        App = _ref.App,
                        wrapApp = _ref.wrapApp,
                        Component1 = _ref.Component,
                        err1 = _ref.err,
                        subscription = _ref.subscription,
                        isFallback = _ref.isFallback,
                        locale = _ref.locale,
                        locales = _ref.locales,
                        defaultLocale = _ref.defaultLocale,
                        domainLocales = _ref.domainLocales,
                        isPreview = _ref.isPreview;

                    _classCallCheck(this, Router);

                    // Static Data Cache
                    this.sdc = {}; // In-flight Server Data Requests, for deduping

                    this.sdr = {};
                    this._idx = 0;

                    this.onPopState = function (e) {
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
                            var _pathname = _this.pathname,
                                _query = _this.query;

                            _this.changeState(
                                "replaceState",
                                (0, _utils).formatWithValidation({
                                    pathname: addBasePath(_pathname),
                                    query: _query,
                                }),
                                (0, _utils).getURL()
                            );

                            return;
                        }

                        if (!state.__N) {
                            return;
                        }

                        var forcedScroll;
                        var url = state.url,
                            as1 = state.as,
                            options = state.options,
                            idx = state.idx;

                        if (false) {
                            var v;
                        }

                        _this._idx = idx;

                        var _parseRelativeUrl2 = (0,
                            _parseRelativeUrl).parseRelativeUrl(url),
                            pathname1 = _parseRelativeUrl2.pathname; // Make sure we don't re-render on initial load,
                        // can be caused by navigating back from an external site

                        if (
                            _this.isSsr &&
                            as1 === _this.asPath &&
                            pathname1 === _this.pathname
                        ) {
                            return;
                        } // If the downstream application returns falsy, return.
                        // They will then be responsible for handling the event.

                        if (_this._bps && !_this._bps(state)) {
                            return;
                        }

                        _this.change(
                            "replaceState",
                            url,
                            as1,
                            Object.assign({}, options, {
                                shallow: options.shallow && _this._shallow,
                                locale: options.locale || _this.defaultLocale,
                            }),
                            forcedScroll
                        );
                    }; // represents the current component key

                    this.route = (0,
                    _normalizeTrailingSlash).removePathTrailingSlash(pathname1); // set up the component cache (by route keys)

                    this.components = {}; // We should not keep the cache, if there's an error
                    // Otherwise, this cause issues when when going back and
                    // come again to the errored page.

                    if (pathname1 !== "/_error") {
                        this.components[this.route] = {
                            Component: Component1,
                            initial: true,
                            props: initialProps,
                            err: err1,
                            __N_SSG: initialProps && initialProps.__N_SSG,
                            __N_SSP: initialProps && initialProps.__N_SSP,
                        };
                    }

                    this.components["/_app"] = {
                        Component: App,
                        styleSheets: [],
                    }; // Backwards compat for Router.router.events
                    // TODO: Should be remove the following major version as it was never documented

                    this.events = Router.events;
                    this.pageLoader = pageLoader;
                    this.pathname = pathname1;
                    this.query = query1; // if auto prerendered and dynamic route wait to update asPath
                    // until after mount to prevent hydration mismatch

                    var autoExportDynamic =
                        (0, _isDynamic).isDynamicRoute(pathname1) &&
                        self.__NEXT_DATA__.autoExport;

                    this.asPath = autoExportDynamic ? pathname1 : as1;
                    this.basePath = basePath;
                    this.sub = subscription;
                    this.clc = null;
                    this._wrapApp = wrapApp; // make sure to ignore extra popState in safari on navigating
                    // back from external site

                    this.isSsr = true;
                    this.isFallback = isFallback;
                    this.isReady = !!(
                        self.__NEXT_DATA__.gssp ||
                        self.__NEXT_DATA__.gip ||
                        (self.__NEXT_DATA__.appGip &&
                            !self.__NEXT_DATA__.gsp) ||
                        (!autoExportDynamic && !self.location.search && !false)
                    );
                    this.isPreview = !!isPreview;
                    this.isLocaleDomain = false;

                    if (false) {
                    }

                    if (true) {
                        // make sure "as" doesn't start with double slashes or else it can
                        // throw an error as it's considered invalid
                        if (as1.substr(0, 2) !== "//") {
                            // in order for `e.state` to work on the `onpopstate` event
                            // we have to register the initial route upon initialization
                            var options = {
                                locale: locale,
                            };
                            options._shouldResolveHref = as1 !== pathname1;
                            this.changeState(
                                "replaceState",
                                (0, _utils).formatWithValidation({
                                    pathname: addBasePath(pathname1),
                                    query: query1,
                                }),
                                (0, _utils).getURL(),
                                options
                            );
                        }

                        window.addEventListener("popstate", this.onPopState); // enable custom scroll restoration handling when available
                        // otherwise fallback to browser's default handling

                        if (false) {
                        }
                    }
                }

                _createClass(Router, [
                    {
                        key: "reload",
                        value: function reload() {
                            window.location.reload();
                        },
                        /**
                         * Go back in history
                         */
                    },
                    {
                        key: "back",
                        value: function back() {
                            window.history.back();
                        },
                        /**
                         * Performs a `pushState` with arguments
                         * @param url of the route
                         * @param as masks `url` for the browser
                         * @param options object you can define `shallow` and other options
                         */
                    },
                    {
                        key: "push",
                        value: function push(url, as) {
                            var options =
                                arguments.length > 2 &&
                                arguments[2] !== undefined
                                    ? arguments[2]
                                    : {};

                            if (false) {
                            }

                            var _prepareUrlAs = prepareUrlAs(this, url, as);

                            url = _prepareUrlAs.url;
                            as = _prepareUrlAs.as;
                            return this.change("pushState", url, as, options);
                        },
                        /**
                         * Performs a `replaceState` with arguments
                         * @param url of the route
                         * @param as masks `url` for the browser
                         * @param options object you can define `shallow` and other options
                         */
                    },
                    {
                        key: "replace",
                        value: function replace(url, as) {
                            var options =
                                arguments.length > 2 &&
                                arguments[2] !== undefined
                                    ? arguments[2]
                                    : {};

                            var _prepareUrlAs2 = prepareUrlAs(this, url, as);

                            url = _prepareUrlAs2.url;
                            as = _prepareUrlAs2.as;
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
                        value: (function () {
                            var _change = _asyncToGenerator(
                                /*#__PURE__*/ _regeneratorRuntime.mark(
                                    function _callee(
                                        method,
                                        url,
                                        as,
                                        options,
                                        forcedScroll
                                    ) {
                                        var shouldResolveHref,
                                            prevLocale,
                                            parsedAs,
                                            localePathResult,
                                            didNavigate,
                                            ref,
                                            detectedDomain,
                                            asNoBasePath,
                                            _options$shallow,
                                            shallow,
                                            routeProps,
                                            cleanedAs,
                                            localeChange,
                                            parsed,
                                            pathname1,
                                            query1,
                                            pages,
                                            rewrites,
                                            _yield$getClientBuild,
                                            resolvedAs,
                                            rewritesResult,
                                            route,
                                            _parsedAs,
                                            asPathname,
                                            routeRegex,
                                            routeMatch,
                                            shouldInterpolate,
                                            interpolatedAs,
                                            missingParams,
                                            ref1,
                                            routeInfo,
                                            _routeInfo,
                                            error,
                                            props,
                                            __N_SSG,
                                            __N_SSP,
                                            destination,
                                            parsedHref,
                                            _prepareUrlAs3,
                                            newUrl,
                                            newAs,
                                            notFoundRoute,
                                            appComp,
                                            isValidShallowRoute,
                                            _scroll,
                                            shouldScroll,
                                            resetScroll;

                                        return _regeneratorRuntime.wrap(
                                            function _callee$(_context) {
                                                while (1) {
                                                    switch (
                                                        (_context.prev =
                                                            _context.next)
                                                    ) {
                                                        case 0:
                                                            if (
                                                                isLocalURL(url)
                                                            ) {
                                                                _context.next = 3;
                                                                break;
                                                            }

                                                            window.location.href =
                                                                url;
                                                            return _context.abrupt(
                                                                "return",
                                                                false
                                                            );

                                                        case 3:
                                                            shouldResolveHref =
                                                                url === as ||
                                                                options._h ||
                                                                options._shouldResolveHref; // for static pages with query params in the URL we delay
                                                            // marking the router ready until after the query is updated

                                                            if (options._h) {
                                                                this.isReady = true;
                                                            }

                                                            prevLocale =
                                                                this.locale;

                                                            if (true) {
                                                                _context.next = 18;
                                                                break;
                                                            }

                                                            this.locale =
                                                                options.locale ===
                                                                false
                                                                    ? this
                                                                          .defaultLocale
                                                                    : options.locale ||
                                                                      this
                                                                          .locale;

                                                            if (
                                                                typeof options.locale ===
                                                                "undefined"
                                                            ) {
                                                                options.locale =
                                                                    this.locale;
                                                            }

                                                            parsedAs = (0,
                                                            _parseRelativeUrl).parseRelativeUrl(
                                                                hasBasePath(as)
                                                                    ? delBasePath(
                                                                          as
                                                                      )
                                                                    : as
                                                            );
                                                            localePathResult =
                                                                (0,
                                                                _normalizeLocalePath).normalizeLocalePath(
                                                                    parsedAs.pathname,
                                                                    this.locales
                                                                );

                                                            if (
                                                                localePathResult.detectedLocale
                                                            ) {
                                                                this.locale =
                                                                    localePathResult.detectedLocale;
                                                                parsedAs.pathname =
                                                                    addBasePath(
                                                                        parsedAs.pathname
                                                                    );
                                                                as = (0,
                                                                _utils).formatWithValidation(
                                                                    parsedAs
                                                                );
                                                                url =
                                                                    addBasePath(
                                                                        (0,
                                                                        _normalizeLocalePath).normalizeLocalePath(
                                                                            hasBasePath(
                                                                                url
                                                                            )
                                                                                ? delBasePath(
                                                                                      url
                                                                                  )
                                                                                : url,
                                                                            this
                                                                                .locales
                                                                        )
                                                                            .pathname
                                                                    );
                                                            }

                                                            didNavigate = false; // we need to wrap this in the env check again since regenerator runtime
                                                            // moves this on its own due to the return

                                                            if (false) {
                                                            }

                                                            detectedDomain =
                                                                detectDomainLocale(
                                                                    this
                                                                        .domainLocales,
                                                                    undefined,
                                                                    this.locale
                                                                ); // we need to wrap this in the env check again since regenerator runtime
                                                            // moves this on its own due to the return

                                                            if (false) {
                                                            }

                                                            if (!didNavigate) {
                                                                _context.next = 18;
                                                                break;
                                                            }

                                                            return _context.abrupt(
                                                                "return",
                                                                new Promise(
                                                                    function () {}
                                                                )
                                                            );

                                                        case 18:
                                                            if (!options._h) {
                                                                this.isSsr = false;
                                                            } // marking route changes as a navigation start entry

                                                            if (_utils.ST) {
                                                                performance.mark(
                                                                    "routeChange"
                                                                );
                                                            }

                                                            (_options$shallow =
                                                                options.shallow),
                                                                (shallow =
                                                                    _options$shallow ===
                                                                    void 0
                                                                        ? false
                                                                        : _options$shallow);
                                                            routeProps = {
                                                                shallow:
                                                                    shallow,
                                                            };

                                                            if (
                                                                this
                                                                    ._inFlightRoute
                                                            ) {
                                                                this.abortComponentLoad(
                                                                    this
                                                                        ._inFlightRoute,
                                                                    routeProps
                                                                );
                                                            }

                                                            as = addBasePath(
                                                                addLocale(
                                                                    hasBasePath(
                                                                        as
                                                                    )
                                                                        ? delBasePath(
                                                                              as
                                                                          )
                                                                        : as,
                                                                    options.locale,
                                                                    this
                                                                        .defaultLocale
                                                                )
                                                            );
                                                            cleanedAs =
                                                                delLocale(
                                                                    hasBasePath(
                                                                        as
                                                                    )
                                                                        ? delBasePath(
                                                                              as
                                                                          )
                                                                        : as,
                                                                    this.locale
                                                                );
                                                            this._inFlightRoute =
                                                                as;
                                                            localeChange =
                                                                prevLocale !==
                                                                this.locale; // If the url change is only related to a hash change
                                                            // We should not proceed. We should only change the state.
                                                            // WARNING: `_h` is an internal option for handing Next.js client-side
                                                            // hydration. Your app should _never_ use this property. It may change at
                                                            // any time without notice.

                                                            if (
                                                                !(
                                                                    !options._h &&
                                                                    this.onlyAHashChange(
                                                                        cleanedAs
                                                                    ) &&
                                                                    !localeChange
                                                                )
                                                            ) {
                                                                _context.next = 35;
                                                                break;
                                                            }

                                                            this.asPath =
                                                                cleanedAs;
                                                            Router.events.emit(
                                                                "hashChangeStart",
                                                                as,
                                                                routeProps
                                                            ); // TODO: do we need the resolved href when only a hash change?

                                                            this.changeState(
                                                                method,
                                                                url,
                                                                as,
                                                                options
                                                            );
                                                            this.scrollToHash(
                                                                cleanedAs
                                                            );
                                                            this.notify(
                                                                this.components[
                                                                    this.route
                                                                ],
                                                                null
                                                            );
                                                            Router.events.emit(
                                                                "hashChangeComplete",
                                                                as,
                                                                routeProps
                                                            );
                                                            return _context.abrupt(
                                                                "return",
                                                                true
                                                            );

                                                        case 35:
                                                            parsed = (0,
                                                            _parseRelativeUrl).parseRelativeUrl(
                                                                url
                                                            );
                                                            (pathname1 =
                                                                parsed.pathname),
                                                                (query1 =
                                                                    parsed.query); // The build manifest needs to be loaded before auto-static dynamic pages
                                                            // get their query parameters to allow ensuring they can be parsed properly
                                                            // when rewritten to

                                                            _context.prev = 37;
                                                            _context.next = 40;
                                                            return this.pageLoader.getPageList();

                                                        case 40:
                                                            pages =
                                                                _context.sent;
                                                            _context.next = 43;
                                                            return (0,
                                                            _routeLoader).getClientBuildManifest();

                                                        case 43:
                                                            _yield$getClientBuild =
                                                                _context.sent;
                                                            rewrites =
                                                                _yield$getClientBuild.__rewrites;
                                                            _context.next = 51;
                                                            break;

                                                        case 47:
                                                            _context.prev = 47;
                                                            _context.t0 =
                                                                _context[
                                                                    "catch"
                                                                ](37);
                                                            // If we fail to resolve the page list or client-build manifest, we must
                                                            // do a server-side transition:
                                                            window.location.href =
                                                                as;
                                                            return _context.abrupt(
                                                                "return",
                                                                false
                                                            );

                                                        case 51:
                                                            // If asked to change the current URL we should reload the current page
                                                            // (not location.reload() but reload getInitialProps and other Next.js stuffs)
                                                            // We also need to set the method = replaceState always
                                                            // as this should not go into the history (That's how browsers work)
                                                            // We should compare the new asPath to the current asPath, not the url
                                                            if (
                                                                !this.urlIsNew(
                                                                    cleanedAs
                                                                ) &&
                                                                !localeChange
                                                            ) {
                                                                method =
                                                                    "replaceState";
                                                            } // we need to resolve the as value using rewrites for dynamic SSG
                                                            // pages to allow building the data URL correctly

                                                            resolvedAs = as; // url and as should always be prefixed with basePath by this
                                                            // point by either next/link or router.push/replace so strip the
                                                            // basePath from the pathname to match the pages dir 1-to-1

                                                            pathname1 =
                                                                pathname1
                                                                    ? (0,
                                                                      _normalizeTrailingSlash).removePathTrailingSlash(
                                                                          delBasePath(
                                                                              pathname1
                                                                          )
                                                                      )
                                                                    : pathname1;

                                                            if (
                                                                shouldResolveHref &&
                                                                pathname1 !==
                                                                    "/_error"
                                                            ) {
                                                                options._shouldResolveHref = true;

                                                                if (false) {
                                                                } else {
                                                                    parsed.pathname =
                                                                        resolveDynamicRoute(
                                                                            pathname1,
                                                                            pages
                                                                        );

                                                                    if (
                                                                        parsed.pathname !==
                                                                        pathname1
                                                                    ) {
                                                                        pathname1 =
                                                                            parsed.pathname;
                                                                        parsed.pathname =
                                                                            addBasePath(
                                                                                pathname1
                                                                            );
                                                                        url =
                                                                            (0,
                                                                            _utils).formatWithValidation(
                                                                                parsed
                                                                            );
                                                                    }
                                                                }
                                                            }

                                                            route = (0,
                                                            _normalizeTrailingSlash).removePathTrailingSlash(
                                                                pathname1
                                                            );

                                                            if (
                                                                isLocalURL(as)
                                                            ) {
                                                                _context.next = 61;
                                                                break;
                                                            }

                                                            if (true) {
                                                                _context.next = 59;
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

                                                        case 59:
                                                            window.location.href =
                                                                as;
                                                            return _context.abrupt(
                                                                "return",
                                                                false
                                                            );

                                                        case 61:
                                                            resolvedAs =
                                                                delLocale(
                                                                    delBasePath(
                                                                        resolvedAs
                                                                    ),
                                                                    this.locale
                                                                );

                                                            if (
                                                                !(0,
                                                                _isDynamic).isDynamicRoute(
                                                                    route
                                                                )
                                                            ) {
                                                                _context.next = 77;
                                                                break;
                                                            }

                                                            _parsedAs = (0,
                                                            _parseRelativeUrl).parseRelativeUrl(
                                                                resolvedAs
                                                            );
                                                            asPathname =
                                                                _parsedAs.pathname;
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
                                                                          query1
                                                                      )
                                                                    : {};

                                                            if (
                                                                !(
                                                                    !routeMatch ||
                                                                    (shouldInterpolate &&
                                                                        !interpolatedAs.result)
                                                                )
                                                            ) {
                                                                _context.next = 76;
                                                                break;
                                                            }

                                                            missingParams =
                                                                Object.keys(
                                                                    routeRegex.groups
                                                                ).filter(
                                                                    function (
                                                                        param
                                                                    ) {
                                                                        return !query1[
                                                                            param
                                                                        ];
                                                                    }
                                                                );

                                                            if (
                                                                !(
                                                                    missingParams.length >
                                                                    0
                                                                )
                                                            ) {
                                                                _context.next = 74;
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

                                                        case 74:
                                                            _context.next = 77;
                                                            break;

                                                        case 76:
                                                            if (
                                                                shouldInterpolate
                                                            ) {
                                                                as = (0,
                                                                _utils).formatWithValidation(
                                                                    Object.assign(
                                                                        {},
                                                                        _parsedAs,
                                                                        {
                                                                            pathname:
                                                                                interpolatedAs.result,
                                                                            query: omitParmsFromQuery(
                                                                                query1,
                                                                                interpolatedAs.params
                                                                            ),
                                                                        }
                                                                    )
                                                                );
                                                            } else {
                                                                // Merge params into `query`, overwriting any specified in search
                                                                Object.assign(
                                                                    query1,
                                                                    routeMatch
                                                                );
                                                            }

                                                        case 77:
                                                            Router.events.emit(
                                                                "routeChangeStart",
                                                                as,
                                                                routeProps
                                                            );
                                                            _context.prev = 78;
                                                            _context.next = 81;
                                                            return this.getRouteInfo(
                                                                route,
                                                                pathname1,
                                                                query1,
                                                                as,
                                                                resolvedAs,
                                                                routeProps
                                                            );

                                                        case 81:
                                                            routeInfo =
                                                                _context.sent;
                                                            (_routeInfo =
                                                                routeInfo),
                                                                (error =
                                                                    _routeInfo.error),
                                                                (props =
                                                                    _routeInfo.props),
                                                                (__N_SSG =
                                                                    _routeInfo.__N_SSG),
                                                                (__N_SSP =
                                                                    _routeInfo.__N_SSP); // handle redirect on client-transition

                                                            if (
                                                                !(
                                                                    (__N_SSG ||
                                                                        __N_SSP) &&
                                                                    props
                                                                )
                                                            ) {
                                                                _context.next = 107;
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
                                                                _context.next = 93;
                                                                break;
                                                            }

                                                            destination =
                                                                props.pageProps
                                                                    .__N_REDIRECT; // check if destination is internal (resolves to a page) and attempt
                                                            // client-navigation if it is falling back to hard navigation if
                                                            // it's not

                                                            if (
                                                                !destination.startsWith(
                                                                    "/"
                                                                )
                                                            ) {
                                                                _context.next = 91;
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
                                                            (_prepareUrlAs3 =
                                                                prepareUrlAs(
                                                                    this,
                                                                    destination,
                                                                    destination
                                                                )),
                                                                (newUrl =
                                                                    _prepareUrlAs3.url),
                                                                (newAs =
                                                                    _prepareUrlAs3.as);
                                                            return _context.abrupt(
                                                                "return",
                                                                this.change(
                                                                    method,
                                                                    newUrl,
                                                                    newAs,
                                                                    options
                                                                )
                                                            );

                                                        case 91:
                                                            window.location.href =
                                                                destination;
                                                            return _context.abrupt(
                                                                "return",
                                                                new Promise(
                                                                    function () {}
                                                                )
                                                            );

                                                        case 93:
                                                            this.isPreview =
                                                                !!props.__N_PREVIEW; // handle SSG data 404

                                                            if (
                                                                !(
                                                                    props.notFound ===
                                                                    SSG_DATA_NOT_FOUND
                                                                )
                                                            ) {
                                                                _context.next = 107;
                                                                break;
                                                            }

                                                            _context.prev = 95;
                                                            _context.next = 98;
                                                            return this.fetchComponent(
                                                                "/404"
                                                            );

                                                        case 98:
                                                            notFoundRoute =
                                                                "/404";
                                                            _context.next = 104;
                                                            break;

                                                        case 101:
                                                            _context.prev = 101;
                                                            _context.t1 =
                                                                _context[
                                                                    "catch"
                                                                ](95);
                                                            notFoundRoute =
                                                                "/_error";

                                                        case 104:
                                                            _context.next = 106;
                                                            return this.getRouteInfo(
                                                                notFoundRoute,
                                                                notFoundRoute,
                                                                query1,
                                                                as,
                                                                resolvedAs,
                                                                {
                                                                    shallow: false,
                                                                }
                                                            );

                                                        case 106:
                                                            routeInfo =
                                                                _context.sent;

                                                        case 107:
                                                            Router.events.emit(
                                                                "beforeHistoryChange",
                                                                as,
                                                                routeProps
                                                            );
                                                            this.changeState(
                                                                method,
                                                                url,
                                                                as,
                                                                options
                                                            );

                                                            if (false) {
                                                            }

                                                            if (
                                                                options._h &&
                                                                pathname1 ===
                                                                    "/_error" &&
                                                                ((ref =
                                                                    self
                                                                        .__NEXT_DATA__
                                                                        .props) ===
                                                                    null ||
                                                                ref === void 0
                                                                    ? void 0
                                                                    : (ref1 =
                                                                          ref.pageProps) ===
                                                                          null ||
                                                                      ref1 ===
                                                                          void 0
                                                                    ? void 0
                                                                    : ref1.statusCode) ===
                                                                    500 &&
                                                                (props ===
                                                                    null ||
                                                                props === void 0
                                                                    ? void 0
                                                                    : props.pageProps)
                                                            ) {
                                                                // ensure statusCode is still correct for static 500 page
                                                                // when updating query information
                                                                props.pageProps.statusCode = 500;
                                                            } // shallow routing is only allowed for same page URL changes.

                                                            isValidShallowRoute =
                                                                options.shallow &&
                                                                this.route ===
                                                                    route;
                                                            shouldScroll =
                                                                (_scroll =
                                                                    options.scroll) !==
                                                                    null &&
                                                                _scroll !==
                                                                    void 0
                                                                    ? _scroll
                                                                    : !isValidShallowRoute;
                                                            resetScroll =
                                                                shouldScroll
                                                                    ? {
                                                                          x: 0,
                                                                          y: 0,
                                                                      }
                                                                    : null;
                                                            _context.next = 116;
                                                            return this.set(
                                                                route,
                                                                pathname1,
                                                                query1,
                                                                cleanedAs,
                                                                routeInfo,
                                                                forcedScroll !==
                                                                    null &&
                                                                    forcedScroll !==
                                                                        void 0
                                                                    ? forcedScroll
                                                                    : resetScroll
                                                            )["catch"](
                                                                function (e) {
                                                                    if (
                                                                        e.cancelled
                                                                    )
                                                                        error =
                                                                            error ||
                                                                            e;
                                                                    else
                                                                        throw e;
                                                                }
                                                            );

                                                        case 116:
                                                            if (!error) {
                                                                _context.next = 119;
                                                                break;
                                                            }

                                                            Router.events.emit(
                                                                "routeChangeError",
                                                                error,
                                                                cleanedAs,
                                                                routeProps
                                                            );
                                                            throw error;

                                                        case 119:
                                                            if (false) {
                                                            }

                                                            Router.events.emit(
                                                                "routeChangeComplete",
                                                                as,
                                                                routeProps
                                                            );
                                                            return _context.abrupt(
                                                                "return",
                                                                true
                                                            );

                                                        case 124:
                                                            _context.prev = 124;
                                                            _context.t2 =
                                                                _context[
                                                                    "catch"
                                                                ](78);

                                                            if (
                                                                !_context.t2
                                                                    .cancelled
                                                            ) {
                                                                _context.next = 128;
                                                                break;
                                                            }

                                                            return _context.abrupt(
                                                                "return",
                                                                false
                                                            );

                                                        case 128:
                                                            throw _context.t2;

                                                        case 129:
                                                        case "end":
                                                            return _context.stop();
                                                    }
                                                }
                                            },
                                            _callee,
                                            this,
                                            [
                                                [37, 47],
                                                [78, 124],
                                                [95, 101],
                                            ]
                                        );
                                    }
                                )
                            );

                            function change(_x, _x2, _x3, _x4, _x5) {
                                return _change.apply(this, arguments);
                            }

                            return change;
                        })(),
                    },
                    {
                        key: "changeState",
                        value: function changeState(method, url, as) {
                            var options =
                                arguments.length > 3 &&
                                arguments[3] !== undefined
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
                                        idx: (this._idx =
                                            method !== "pushState"
                                                ? this._idx
                                                : this._idx + 1),
                                    }, // Most browsers currently ignores this parameter, although they may use it in the future.
                                    // Passing the empty string here should be safe against future changes to the method.
                                    // https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
                                    "",
                                    as
                                );
                            }
                        },
                    },
                    {
                        key: "handleRouteInfoError",
                        value: (function () {
                            var _handleRouteInfoError = _asyncToGenerator(
                                /*#__PURE__*/ _regeneratorRuntime.mark(
                                    function _callee2(
                                        err,
                                        pathname,
                                        query,
                                        as,
                                        routeProps,
                                        loadErrorFail
                                    ) {
                                        var Component1,
                                            styleSheets,
                                            props,
                                            _yield$this$fetchComp,
                                            routeInfo;

                                        return _regeneratorRuntime.wrap(
                                            function _callee2$(_context2) {
                                                while (1) {
                                                    switch (
                                                        (_context2.prev =
                                                            _context2.next)
                                                    ) {
                                                        case 0:
                                                            if (
                                                                !err.cancelled
                                                            ) {
                                                                _context2.next = 2;
                                                                break;
                                                            }

                                                            throw err;

                                                        case 2:
                                                            if (
                                                                !(
                                                                    (0,
                                                                    _routeLoader).isAssetError(
                                                                        err
                                                                    ) ||
                                                                    loadErrorFail
                                                                )
                                                            ) {
                                                                _context2.next = 6;
                                                                break;
                                                            }

                                                            Router.events.emit(
                                                                "routeChangeError",
                                                                err,
                                                                as,
                                                                routeProps
                                                            ); // If we can't load the page it could be one of following reasons
                                                            //  1. Page doesn't exists
                                                            //  2. Page does exist in a different zone
                                                            //  3. Internal error while loading the page
                                                            // So, doing a hard reload is the proper way to deal with this.

                                                            window.location.href =
                                                                as; // Changing the URL doesn't block executing the current code path.
                                                            // So let's throw a cancellation error stop the routing logic.

                                                            throw buildCancellationError();

                                                        case 6:
                                                            _context2.prev = 6;

                                                            if (
                                                                !(
                                                                    typeof Component1 ===
                                                                        "undefined" ||
                                                                    typeof styleSheets ===
                                                                        "undefined"
                                                                )
                                                            ) {
                                                                _context2.next = 13;
                                                                break;
                                                            }

                                                            _context2.next = 10;
                                                            return this.fetchComponent(
                                                                "/_error"
                                                            );

                                                        case 10:
                                                            _yield$this$fetchComp =
                                                                _context2.sent;
                                                            Component1 =
                                                                _yield$this$fetchComp.page;
                                                            styleSheets =
                                                                _yield$this$fetchComp.styleSheets;

                                                        case 13:
                                                            routeInfo = {
                                                                props: props,
                                                                Component:
                                                                    Component1,
                                                                styleSheets:
                                                                    styleSheets,
                                                                err: err,
                                                                error: err,
                                                            };

                                                            if (
                                                                routeInfo.props
                                                            ) {
                                                                _context2.next = 25;
                                                                break;
                                                            }

                                                            _context2.prev = 15;
                                                            _context2.next = 18;
                                                            return this.getInitialProps(
                                                                Component1,
                                                                {
                                                                    err: err,
                                                                    pathname:
                                                                        pathname,
                                                                    query: query,
                                                                }
                                                            );

                                                        case 18:
                                                            routeInfo.props =
                                                                _context2.sent;
                                                            _context2.next = 25;
                                                            break;

                                                        case 21:
                                                            _context2.prev = 21;
                                                            _context2.t0 =
                                                                _context2[
                                                                    "catch"
                                                                ](15);
                                                            console.error(
                                                                "Error in error page `getInitialProps`: ",
                                                                _context2.t0
                                                            );
                                                            routeInfo.props =
                                                                {};

                                                        case 25:
                                                            return _context2.abrupt(
                                                                "return",
                                                                routeInfo
                                                            );

                                                        case 28:
                                                            _context2.prev = 28;
                                                            _context2.t1 =
                                                                _context2[
                                                                    "catch"
                                                                ](6);
                                                            return _context2.abrupt(
                                                                "return",
                                                                this.handleRouteInfoError(
                                                                    _context2.t1,
                                                                    pathname,
                                                                    query,
                                                                    as,
                                                                    routeProps,
                                                                    true
                                                                )
                                                            );

                                                        case 31:
                                                        case "end":
                                                            return _context2.stop();
                                                    }
                                                }
                                            },
                                            _callee2,
                                            this,
                                            [
                                                [6, 28],
                                                [15, 21],
                                            ]
                                        );
                                    }
                                )
                            );

                            function handleRouteInfoError(
                                _x6,
                                _x7,
                                _x8,
                                _x9,
                                _x10,
                                _x11
                            ) {
                                return _handleRouteInfoError.apply(
                                    this,
                                    arguments
                                );
                            }

                            return handleRouteInfoError;
                        })(),
                    },
                    {
                        key: "getRouteInfo",
                        value: (function () {
                            var _getRouteInfo = _asyncToGenerator(
                                /*#__PURE__*/ _regeneratorRuntime.mark(
                                    function _callee3(
                                        route,
                                        pathname,
                                        query,
                                        as,
                                        resolvedAs,
                                        routeProps
                                    ) {
                                        var _this2 = this;

                                        var existingRouteInfo,
                                            cachedRouteInfo,
                                            routeInfo,
                                            Component1,
                                            __N_SSG,
                                            __N_SSP,
                                            _require,
                                            isValidElementType,
                                            dataHref,
                                            props;

                                        return _regeneratorRuntime.wrap(
                                            function _callee3$(_context3) {
                                                while (1) {
                                                    switch (
                                                        (_context3.prev =
                                                            _context3.next)
                                                    ) {
                                                        case 0:
                                                            _context3.prev = 0;
                                                            existingRouteInfo =
                                                                this.components[
                                                                    route
                                                                ];

                                                            if (
                                                                !(
                                                                    routeProps.shallow &&
                                                                    existingRouteInfo &&
                                                                    this
                                                                        .route ===
                                                                        route
                                                                )
                                                            ) {
                                                                _context3.next = 4;
                                                                break;
                                                            }

                                                            return _context3.abrupt(
                                                                "return",
                                                                existingRouteInfo
                                                            );

                                                        case 4:
                                                            cachedRouteInfo =
                                                                existingRouteInfo &&
                                                                "initial" in
                                                                    existingRouteInfo
                                                                    ? undefined
                                                                    : existingRouteInfo;

                                                            if (
                                                                !cachedRouteInfo
                                                            ) {
                                                                _context3.next = 9;
                                                                break;
                                                            }

                                                            _context3.t0 =
                                                                cachedRouteInfo;
                                                            _context3.next = 12;
                                                            break;

                                                        case 9:
                                                            _context3.next = 11;
                                                            return this.fetchComponent(
                                                                route
                                                            ).then(function (
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
                                                                };
                                                            });

                                                        case 11:
                                                            _context3.t0 =
                                                                _context3.sent;

                                                        case 12:
                                                            routeInfo =
                                                                _context3.t0;
                                                            (Component1 =
                                                                routeInfo.Component),
                                                                (__N_SSG =
                                                                    routeInfo.__N_SSG),
                                                                (__N_SSP =
                                                                    routeInfo.__N_SSP);

                                                            if (true) {
                                                                _context3.next = 18;
                                                                break;
                                                            }

                                                            (_require =
                                                                __webpack_require__(
                                                                    Object(
                                                                        (function webpackMissingModule() {
                                                                            var e =
                                                                                new Error(
                                                                                    "Cannot find module 'react-is'"
                                                                                );
                                                                            e.code =
                                                                                "MODULE_NOT_FOUND";
                                                                            throw e;
                                                                        })()
                                                                    )
                                                                )),
                                                                (isValidElementType =
                                                                    _require.isValidElementType);

                                                            if (
                                                                isValidElementType(
                                                                    Component1
                                                                )
                                                            ) {
                                                                _context3.next = 18;
                                                                break;
                                                            }

                                                            throw new Error(
                                                                'The default export is not a React Component in page: "'.concat(
                                                                    pathname,
                                                                    '"'
                                                                )
                                                            );

                                                        case 18:
                                                            if (
                                                                __N_SSG ||
                                                                __N_SSP
                                                            ) {
                                                                dataHref =
                                                                    this.pageLoader.getDataHref(
                                                                        (0,
                                                                        _utils).formatWithValidation(
                                                                            {
                                                                                pathname:
                                                                                    pathname,
                                                                                query: query,
                                                                            }
                                                                        ),
                                                                        resolvedAs,
                                                                        __N_SSG,
                                                                        this
                                                                            .locale
                                                                    );
                                                            }

                                                            _context3.next = 21;
                                                            return this._getData(
                                                                function () {
                                                                    return __N_SSG
                                                                        ? _this2._getStaticData(
                                                                              dataHref
                                                                          )
                                                                        : __N_SSP
                                                                        ? _this2._getServerData(
                                                                              dataHref
                                                                          )
                                                                        : _this2.getInitialProps(
                                                                              Component1, // we provide AppTree later so this needs to be `any`
                                                                              {
                                                                                  pathname:
                                                                                      pathname,
                                                                                  query: query,
                                                                                  asPath: as,
                                                                                  locale: _this2.locale,
                                                                                  locales:
                                                                                      _this2.locales,
                                                                                  defaultLocale:
                                                                                      _this2.defaultLocale,
                                                                              }
                                                                          );
                                                                }
                                                            );

                                                        case 21:
                                                            props =
                                                                _context3.sent;
                                                            routeInfo.props =
                                                                props;
                                                            this.components[
                                                                route
                                                            ] = routeInfo;
                                                            return _context3.abrupt(
                                                                "return",
                                                                routeInfo
                                                            );

                                                        case 27:
                                                            _context3.prev = 27;
                                                            _context3.t1 =
                                                                _context3[
                                                                    "catch"
                                                                ](0);
                                                            return _context3.abrupt(
                                                                "return",
                                                                this.handleRouteInfoError(
                                                                    _context3.t1,
                                                                    pathname,
                                                                    query,
                                                                    as,
                                                                    routeProps
                                                                )
                                                            );

                                                        case 30:
                                                        case "end":
                                                            return _context3.stop();
                                                    }
                                                }
                                            },
                                            _callee3,
                                            this,
                                            [[0, 27]]
                                        );
                                    }
                                )
                            );

                            function getRouteInfo(
                                _x12,
                                _x13,
                                _x14,
                                _x15,
                                _x16,
                                _x17
                            ) {
                                return _getRouteInfo.apply(this, arguments);
                            }

                            return getRouteInfo;
                        })(),
                    },
                    {
                        key: "set",
                        value: function set(
                            route,
                            pathname,
                            query,
                            as,
                            data,
                            resetScroll
                        ) {
                            this.isFallback = false;
                            this.route = route;
                            this.pathname = pathname;
                            this.query = query;
                            this.asPath = as;
                            return this.notify(data, resetScroll);
                        },
                        /**
                         * Callback to execute before replacing router state
                         * @param cb callback to be executed
                         */
                    },
                    {
                        key: "beforePopState",
                        value: function beforePopState(cb) {
                            this._bps = cb;
                        },
                    },
                    {
                        key: "onlyAHashChange",
                        value: function onlyAHashChange(as) {
                            if (!this.asPath) return false;

                            var _this$asPath$split = this.asPath.split("#"),
                                _this$asPath$split2 = _slicedToArray(
                                    _this$asPath$split,
                                    2
                                ),
                                oldUrlNoHash = _this$asPath$split2[0],
                                oldHash = _this$asPath$split2[1];

                            var _as$split = as.split("#"),
                                _as$split2 = _slicedToArray(_as$split, 2),
                                newUrlNoHash = _as$split2[0],
                                newHash = _as$split2[1]; // Makes sure we scroll to the provided hash if the url/hash are the same

                            if (
                                newHash &&
                                oldUrlNoHash === newUrlNoHash &&
                                oldHash === newHash
                            ) {
                                return true;
                            } // If the urls are change, there's more than a hash change

                            if (oldUrlNoHash !== newUrlNoHash) {
                                return false;
                            } // If the hash has changed, then it's a hash only change.
                            // This check is necessary to handle both the enter and
                            // leave hash === '' cases. The identity case falls through
                            // and is treated as a next reload.

                            return oldHash !== newHash;
                        },
                    },
                    {
                        key: "scrollToHash",
                        value: function scrollToHash(as) {
                            var _as$split3 = as.split("#"),
                                _as$split4 = _slicedToArray(_as$split3, 2),
                                hash = _as$split4[1]; // Scroll to top if the hash is just `#` with no value or `#top`
                            // To mirror browsers

                            if (hash === "" || hash === "top") {
                                window.scrollTo(0, 0);
                                return;
                            } // First we check if the element by id is found

                            var idEl = document.getElementById(hash);

                            if (idEl) {
                                idEl.scrollIntoView();
                                return;
                            } // If there's no element with the id, we check the `name` property
                            // To mirror browsers

                            var nameEl = document.getElementsByName(hash)[0];

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
                        /**
                         * Prefetch page code, you may wait for the data during page rendering.
                         * This feature only works in production!
                         * @param url the href of prefetched page
                         * @param asPath the as path of the prefetched page
                         */
                    },
                    {
                        key: "prefetch",
                        value: (function () {
                            var _prefetch = _asyncToGenerator(
                                /*#__PURE__*/ _regeneratorRuntime.mark(
                                    function _callee4(url) {
                                        var _this3 = this;

                                        var asPath,
                                            options,
                                            parsed,
                                            pathname2,
                                            parsedAs,
                                            localePathResult,
                                            pages,
                                            resolvedAs,
                                            rewrites,
                                            _yield$getClientBuild2,
                                            rewritesResult,
                                            route,
                                            _args4 = arguments;

                                        return _regeneratorRuntime.wrap(
                                            function _callee4$(_context4) {
                                                while (1) {
                                                    switch (
                                                        (_context4.prev =
                                                            _context4.next)
                                                    ) {
                                                        case 0:
                                                            asPath =
                                                                _args4.length >
                                                                    1 &&
                                                                _args4[1] !==
                                                                    undefined
                                                                    ? _args4[1]
                                                                    : url;
                                                            options =
                                                                _args4.length >
                                                                    2 &&
                                                                _args4[2] !==
                                                                    undefined
                                                                    ? _args4[2]
                                                                    : {};
                                                            parsed = (0,
                                                            _parseRelativeUrl).parseRelativeUrl(
                                                                url
                                                            );
                                                            pathname2 =
                                                                parsed.pathname;

                                                            if (false) {
                                                            }

                                                            _context4.next = 7;
                                                            return this.pageLoader.getPageList();

                                                        case 7:
                                                            pages =
                                                                _context4.sent;
                                                            resolvedAs = asPath;

                                                            if (true) {
                                                                _context4.next = 19;
                                                                break;
                                                            }

                                                            _context4.next = 12;
                                                            return (0,
                                                            _routeLoader).getClientBuildManifest();

                                                        case 12:
                                                            _yield$getClientBuild2 =
                                                                _context4.sent;
                                                            rewrites =
                                                                _yield$getClientBuild2.__rewrites;
                                                            rewritesResult = (0,
                                                            _resolveRewrites)[
                                                                "default"
                                                            ](
                                                                addBasePath(
                                                                    addLocale(
                                                                        asPath,
                                                                        this
                                                                            .locale
                                                                    )
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
                                                                this.locales
                                                            );
                                                            resolvedAs =
                                                                delLocale(
                                                                    delBasePath(
                                                                        rewritesResult.asPath
                                                                    ),
                                                                    this.locale
                                                                );

                                                            if (
                                                                rewritesResult.matchedPage &&
                                                                rewritesResult.resolvedHref
                                                            ) {
                                                                // if this directly matches a page we need to update the href to
                                                                // allow the correct page chunk to be loaded
                                                                pathname2 =
                                                                    rewritesResult.resolvedHref;
                                                                parsed.pathname =
                                                                    pathname2;
                                                                url = (0,
                                                                _utils).formatWithValidation(
                                                                    parsed
                                                                );
                                                            }

                                                            _context4.next = 21;
                                                            break;

                                                        case 19:
                                                            parsed.pathname =
                                                                resolveDynamicRoute(
                                                                    parsed.pathname,
                                                                    pages
                                                                );

                                                            if (
                                                                parsed.pathname !==
                                                                pathname2
                                                            ) {
                                                                pathname2 =
                                                                    parsed.pathname;
                                                                parsed.pathname =
                                                                    pathname2;
                                                                url = (0,
                                                                _utils).formatWithValidation(
                                                                    parsed
                                                                );
                                                            }

                                                        case 21:
                                                            route = (0,
                                                            _normalizeTrailingSlash).removePathTrailingSlash(
                                                                pathname2
                                                            ); // Prefetch is not supported in development mode because it would trigger on-demand-entries

                                                            if (true) {
                                                                _context4.next = 24;
                                                                break;
                                                            }

                                                            return _context4.abrupt(
                                                                "return"
                                                            );

                                                        case 24:
                                                            _context4.next = 26;
                                                            return Promise.all([
                                                                this.pageLoader
                                                                    ._isSsg(
                                                                        route
                                                                    )
                                                                    .then(
                                                                        function (
                                                                            isSsg
                                                                        ) {
                                                                            return isSsg
                                                                                ? _this3._getStaticData(
                                                                                      _this3.pageLoader.getDataHref(
                                                                                          url,
                                                                                          resolvedAs,
                                                                                          true,
                                                                                          typeof options.locale !==
                                                                                              "undefined"
                                                                                              ? options.locale
                                                                                              : _this3.locale
                                                                                      )
                                                                                  )
                                                                                : false;
                                                                        }
                                                                    ),
                                                                this.pageLoader[
                                                                    options.priority
                                                                        ? "loadPage"
                                                                        : "prefetch"
                                                                ](route),
                                                            ]);

                                                        case 26:
                                                        case "end":
                                                            return _context4.stop();
                                                    }
                                                }
                                            },
                                            _callee4,
                                            this
                                        );
                                    }
                                )
                            );

                            function prefetch(_x18) {
                                return _prefetch.apply(this, arguments);
                            }

                            return prefetch;
                        })(),
                    },
                    {
                        key: "fetchComponent",
                        value: (function () {
                            var _fetchComponent = _asyncToGenerator(
                                /*#__PURE__*/ _regeneratorRuntime.mark(
                                    function _callee5(route) {
                                        var cancelled,
                                            cancel,
                                            componentResult,
                                            error;
                                        return _regeneratorRuntime.wrap(
                                            function _callee5$(_context5) {
                                                while (1) {
                                                    switch (
                                                        (_context5.prev =
                                                            _context5.next)
                                                    ) {
                                                        case 0:
                                                            cancelled = false;

                                                            cancel = this.clc =
                                                                function () {
                                                                    cancelled = true;
                                                                };

                                                            _context5.next = 4;
                                                            return this.pageLoader.loadPage(
                                                                route
                                                            );

                                                        case 4:
                                                            componentResult =
                                                                _context5.sent;

                                                            if (!cancelled) {
                                                                _context5.next = 9;
                                                                break;
                                                            }

                                                            error = new Error(
                                                                'Abort fetching component for route: "'.concat(
                                                                    route,
                                                                    '"'
                                                                )
                                                            );
                                                            error.cancelled = true;
                                                            throw error;

                                                        case 9:
                                                            if (
                                                                cancel ===
                                                                this.clc
                                                            ) {
                                                                this.clc = null;
                                                            }

                                                            return _context5.abrupt(
                                                                "return",
                                                                componentResult
                                                            );

                                                        case 11:
                                                        case "end":
                                                            return _context5.stop();
                                                    }
                                                }
                                            },
                                            _callee5,
                                            this
                                        );
                                    }
                                )
                            );

                            function fetchComponent(_x19) {
                                return _fetchComponent.apply(this, arguments);
                            }

                            return fetchComponent;
                        })(),
                    },
                    {
                        key: "_getData",
                        value: function _getData(fn) {
                            var _this4 = this;

                            var cancelled = false;

                            var cancel = function cancel() {
                                cancelled = true;
                            };

                            this.clc = cancel;
                            return fn().then(function (data) {
                                if (cancel === _this4.clc) {
                                    _this4.clc = null;
                                }

                                if (cancelled) {
                                    var err2 = new Error(
                                        "Loading initial props cancelled"
                                    );
                                    err2.cancelled = true;
                                    throw err2;
                                }

                                return data;
                            });
                        },
                    },
                    {
                        key: "_getStaticData",
                        value: function _getStaticData(dataHref) {
                            var _this5 = this;

                            var _URL = new URL(dataHref, window.location.href),
                                cacheKey = _URL.href;

                            if (true && !this.isPreview && this.sdc[cacheKey]) {
                                return Promise.resolve(this.sdc[cacheKey]);
                            }

                            return fetchNextData(dataHref, this.isSsr).then(
                                function (data) {
                                    _this5.sdc[cacheKey] = data;
                                    return data;
                                }
                            );
                        },
                    },
                    {
                        key: "_getServerData",
                        value: function _getServerData(dataHref) {
                            var _this6 = this;

                            var _URL2 = new URL(dataHref, window.location.href),
                                resourceKey = _URL2.href;

                            if (this.sdr[resourceKey]) {
                                return this.sdr[resourceKey];
                            }

                            return (this.sdr[resourceKey] = fetchNextData(
                                dataHref,
                                this.isSsr
                            )
                                .then(function (data) {
                                    delete _this6.sdr[resourceKey];
                                    return data;
                                })
                                ["catch"](function (err2) {
                                    delete _this6.sdr[resourceKey];
                                    throw err2;
                                }));
                        },
                    },
                    {
                        key: "getInitialProps",
                        value: function getInitialProps(Component, ctx) {
                            var App1 = this.components["/_app"].Component;

                            var AppTree = this._wrapApp(App1);

                            ctx.AppTree = AppTree;
                            return (0, _utils).loadGetInitialProps(App1, {
                                AppTree: AppTree,
                                Component: Component,
                                router: this,
                                ctx: ctx,
                            });
                        },
                    },
                    {
                        key: "abortComponentLoad",
                        value: function abortComponentLoad(as, routeProps) {
                            if (this.clc) {
                                Router.events.emit(
                                    "routeChangeError",
                                    buildCancellationError(),
                                    as,
                                    routeProps
                                );
                                this.clc();
                                this.clc = null;
                            }
                        },
                    },
                    {
                        key: "notify",
                        value: function notify(data, resetScroll) {
                            return this.sub(
                                data,
                                this.components["/_app"].Component,
                                resetScroll
                            );
                        },
                    },
                ]);

                return Router;
            })();

            Router.events = (0, _mitt)["default"]();
            exports.default = Router;

            /***/
        },

        /***/ 1857: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.formatUrl = formatUrl;

            var querystring = _interopRequireWildcard(
                __webpack_require__(6136)
            );

            function _interopRequireWildcard(obj) {
                if (obj && obj.__esModule) {
                    return obj;
                } else {
                    var newObj = {};

                    if (obj != null) {
                        for (var key in obj) {
                            if (
                                Object.prototype.hasOwnProperty.call(obj, key)
                            ) {
                                var desc =
                                    Object.defineProperty &&
                                    Object.getOwnPropertyDescriptor
                                        ? Object.getOwnPropertyDescriptor(
                                              obj,
                                              key
                                          )
                                        : {};

                                if (desc.get || desc.set) {
                                    Object.defineProperty(newObj, key, desc);
                                } else {
                                    newObj[key] = obj[key];
                                }
                            }
                        }
                    }

                    newObj["default"] = obj;
                    return newObj;
                }
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
                if (protocol && protocol.substr(-1) !== ":") protocol += ":";

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

            /***/
        },

        /***/ 3794: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.default = getAssetPathFromRoute;

            function getAssetPathFromRoute(route) {
                var ext =
                    arguments.length > 1 && arguments[1] !== undefined
                        ? arguments[1]
                        : "";
                var path =
                    route === "/"
                        ? "/index"
                        : /^\/index(\/|$)/.test(route)
                        ? "/index".concat(route)
                        : "".concat(route);
                return path + ext;
            }

            /***/
        },

        /***/ 2140: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.isDynamicRoute = isDynamicRoute; // Identify /[param]/ in route string

            var TEST_ROUTE = /\/\[[^/]+?\](?=\/|$)/;

            function isDynamicRoute(route) {
                return TEST_ROUTE.test(route);
            }

            /***/
        },

        /***/ 5284: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.parseRelativeUrl = parseRelativeUrl;

            var _utils = __webpack_require__(6373);

            var _querystring = __webpack_require__(6136);

            function parseRelativeUrl(url, base) {
                var globalBase = new URL(
                    false ? 0 : (0, _utils).getLocationOrigin()
                );
                var resolvedBase = base
                    ? new URL(base, globalBase)
                    : globalBase;

                var _URL = new URL(url, resolvedBase),
                    pathname = _URL.pathname,
                    searchParams = _URL.searchParams,
                    search = _URL.search,
                    hash = _URL.hash,
                    href = _URL.href,
                    origin = _URL.origin;

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
            }

            /***/
        },

        /***/ 6136: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _slicedToArray = __webpack_require__(3408);

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
                Object.entries(urlQuery).forEach(function (_ref) {
                    var _ref2 = _slicedToArray(_ref, 2),
                        key = _ref2[0],
                        value = _ref2[1];

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
                        return target["delete"](key);
                    });
                    searchParams.forEach(function (value, key) {
                        return target.append(key, value);
                    });
                });
                return target;
            }

            /***/
        },

        /***/ 2106: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.getRouteMatcher = getRouteMatcher;

            var _utils = __webpack_require__(6373);

            function getRouteMatcher(routeRegex) {
                var re = routeRegex.re,
                    groups = routeRegex.groups;
                return function (pathname) {
                    var routeMatch = re.exec(pathname);

                    if (!routeMatch) {
                        return false;
                    }

                    var decode = function decode(param) {
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
            }

            /***/
        },

        /***/ 4339: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.getParametrizedRoute = getParametrizedRoute;
            exports.getRouteRegex = getRouteRegex; // this isn't importing the escape-string-regex module
            // to reduce bytes

            function escapeRegex(str) {
                return str.replace(/[|\\{}()[\]^$+*?.-]/g, "\\$&");
            }

            function parseParameter(param) {
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

            function getParametrizedRoute(route) {
                var segments = (route.replace(/\/$/, "") || "/")
                    .slice(1)
                    .split("/");
                var groups = {};
                var groupIndex = 1;
                var parameterizedRoute = segments
                    .map(function (segment) {
                        if (segment.startsWith("[") && segment.endsWith("]")) {
                            var _parseParameter = parseParameter(
                                    segment.slice(1, -1)
                                ),
                                key = _parseParameter.key,
                                optional = _parseParameter.optional,
                                repeat = _parseParameter.repeat;

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
                            return "/".concat(escapeRegex(segment));
                        }
                    })
                    .join(""); // dead code eliminate for browser since it's only needed
                // while generating routes-manifest

                if (false) {
                    var namedParameterizedRoute,
                        routeKeys,
                        getSafeRouteKey,
                        routeKeyCharLength,
                        routeKeyCharCode;
                }

                return {
                    parameterizedRoute: parameterizedRoute,
                    groups: groups,
                };
            }

            function getRouteRegex(normalizedRoute) {
                var result = getParametrizedRoute(normalizedRoute);

                if ("routeKeys" in result) {
                    return {
                        re: new RegExp(
                            "^".concat(result.parameterizedRoute, "(?:/)?$")
                        ),
                        groups: result.groups,
                        routeKeys: result.routeKeys,
                        namedRegex: "^".concat(
                            result.namedParameterizedRoute,
                            "(?:/)?$"
                        ),
                    };
                }

                return {
                    re: new RegExp(
                        "^".concat(result.parameterizedRoute, "(?:/)?$")
                    ),
                    groups: result.groups,
                };
            }

            /***/
        },

        /***/ 3338: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.setConfig = setConfig;
            exports.default = void 0;
            var runtimeConfig;

            var _default = function _default() {
                return runtimeConfig;
            };

            exports.default = _default;

            function setConfig(configValue) {
                runtimeConfig = configValue;
            }

            /***/
        },

        /***/ 2097: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _toConsumableArray = __webpack_require__(9571);

            var _classCallCheck = __webpack_require__(4988);

            var _createClass = __webpack_require__(9590);

            var _assertThisInitialized = __webpack_require__(9382);

            var _inherits = __webpack_require__(4546);

            var _possibleConstructorReturn = __webpack_require__(1581);

            var _getPrototypeOf = __webpack_require__(852);

            function _createSuper(Derived) {
                var hasNativeReflectConstruct = _isNativeReflectConstruct();
                return function _createSuperInternal() {
                    var Super = _getPrototypeOf(Derived),
                        result;
                    if (hasNativeReflectConstruct) {
                        var NewTarget = _getPrototypeOf(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else {
                        result = Super.apply(this, arguments);
                    }
                    return _possibleConstructorReturn(this, result);
                };
            }

            function _isNativeReflectConstruct() {
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

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.default = void 0;

            var _react = __webpack_require__(2735);

            var isServer = false;

            var _class = /*#__PURE__*/ (function (_react$Component) {
                _inherits(_class, _react$Component);

                var _super = _createSuper(_class);

                function _class(props) {
                    var _this;

                    _classCallCheck(this, _class);

                    _this = _super.call(this, props);

                    _this.emitChange = function () {
                        if (_this._hasHeadManager) {
                            _this.props.headManager.updateHead(
                                _this.props.reduceComponentsToState(
                                    _toConsumableArray(
                                        _this.props.headManager.mountedInstances
                                    ),
                                    _this.props
                                )
                            );
                        }
                    };

                    _this._hasHeadManager =
                        _this.props.headManager &&
                        _this.props.headManager.mountedInstances;

                    if (isServer && _this._hasHeadManager) {
                        _this.props.headManager.mountedInstances.add(
                            _assertThisInitialized(_this)
                        );

                        _this.emitChange();
                    }

                    return _this;
                }

                _createClass(_class, [
                    {
                        key: "componentDidMount",
                        value: function componentDidMount() {
                            if (this._hasHeadManager) {
                                this.props.headManager.mountedInstances.add(
                                    this
                                );
                            }

                            this.emitChange();
                        },
                    },
                    {
                        key: "componentDidUpdate",
                        value: function componentDidUpdate() {
                            this.emitChange();
                        },
                    },
                    {
                        key: "componentWillUnmount",
                        value: function componentWillUnmount() {
                            if (this._hasHeadManager) {
                                this.props.headManager.mountedInstances[
                                    "delete"
                                ](this);
                            }

                            this.emitChange();
                        },
                    },
                    {
                        key: "render",
                        value: function render() {
                            return null;
                        },
                    },
                ]);

                return _class;
            })(_react.Component);

            exports.default = _class;

            /***/
        },

        /***/ 6373: /***/ function (
            __unused_webpack_module,
            exports,
            __webpack_require__
        ) {
            "use strict";

            var _regeneratorRuntime = __webpack_require__(7945);

            var _classCallCheck = __webpack_require__(4988);

            var _inherits = __webpack_require__(4546);

            var _possibleConstructorReturn = __webpack_require__(1581);

            var _getPrototypeOf = __webpack_require__(852);

            var _wrapNativeSuper = __webpack_require__(8545);

            var _asyncToGenerator = __webpack_require__(5374);

            function _createSuper(Derived) {
                var hasNativeReflectConstruct = _isNativeReflectConstruct();
                return function _createSuperInternal() {
                    var Super = _getPrototypeOf(Derived),
                        result;
                    if (hasNativeReflectConstruct) {
                        var NewTarget = _getPrototypeOf(this).constructor;
                        result = Reflect.construct(Super, arguments, NewTarget);
                    } else {
                        result = Super.apply(this, arguments);
                    }
                    return _possibleConstructorReturn(this, result);
                };
            }

            function _isNativeReflectConstruct() {
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

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.execOnce = execOnce;
            exports.getLocationOrigin = getLocationOrigin;
            exports.getURL = getURL;
            exports.getDisplayName = getDisplayName;
            exports.isResSent = isResSent;
            exports.loadGetInitialProps = loadGetInitialProps;
            exports.formatWithValidation = formatWithValidation;
            exports.ST = exports.SP = exports.urlObjectKeys = void 0;

            var _formatUrl = __webpack_require__(1857);

            function execOnce(fn) {
                var used = false;
                var result;
                return function () {
                    if (!used) {
                        used = true;
                        result = fn.apply(void 0, arguments);
                    }

                    return result;
                };
            }

            function getLocationOrigin() {
                var _window$location = window.location,
                    protocol = _window$location.protocol,
                    hostname = _window$location.hostname,
                    port = _window$location.port;
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

            function loadGetInitialProps(_x, _x2) {
                return _loadGetInitialProps.apply(this, arguments);
            }

            function _loadGetInitialProps() {
                _loadGetInitialProps = _asyncToGenerator(
                    /*#__PURE__*/ _regeneratorRuntime.mark(function _callee(
                        App,
                        ctx
                    ) {
                        var ref, message, res, props, _message;

                        return _regeneratorRuntime.wrap(function _callee$(
                            _context
                        ) {
                            while (1) {
                                switch ((_context.prev = _context.next)) {
                                    case 0:
                                        if (true) {
                                            _context.next = 4;
                                            break;
                                        }

                                        if (
                                            !((ref = App.prototype) === null ||
                                            ref === void 0
                                                ? void 0
                                                : ref.getInitialProps)
                                        ) {
                                            _context.next = 4;
                                            break;
                                        }

                                        message = '"'.concat(
                                            getDisplayName(App),
                                            '.getInitialProps()" is defined as an instance method - visit https://nextjs.org/docs/messages/get-initial-props-as-an-instance-method for more information.'
                                        );
                                        throw new Error(message);

                                    case 4:
                                        // when called from _app `ctx` is nested in `ctx`
                                        res =
                                            ctx.res || (ctx.ctx && ctx.ctx.res);

                                        if (App.getInitialProps) {
                                            _context.next = 12;
                                            break;
                                        }

                                        if (!(ctx.ctx && ctx.Component)) {
                                            _context.next = 11;
                                            break;
                                        }

                                        _context.next = 9;
                                        return loadGetInitialProps(
                                            ctx.Component,
                                            ctx.ctx
                                        );

                                    case 9:
                                        _context.t0 = _context.sent;
                                        return _context.abrupt("return", {
                                            pageProps: _context.t0,
                                        });

                                    case 11:
                                        return _context.abrupt("return", {});

                                    case 12:
                                        _context.next = 14;
                                        return App.getInitialProps(ctx);

                                    case 14:
                                        props = _context.sent;

                                        if (!(res && isResSent(res))) {
                                            _context.next = 17;
                                            break;
                                        }

                                        return _context.abrupt("return", props);

                                    case 17:
                                        if (props) {
                                            _context.next = 20;
                                            break;
                                        }

                                        _message = '"'
                                            .concat(
                                                getDisplayName(App),
                                                '.getInitialProps()" should resolve to an object. But found "'
                                            )
                                            .concat(props, '" instead.');
                                        throw new Error(_message);

                                    case 20:
                                        if (false) {
                                        }

                                        return _context.abrupt("return", props);

                                    case 22:
                                    case "end":
                                        return _context.stop();
                                }
                            }
                        },
                        _callee);
                    })
                );
                return _loadGetInitialProps.apply(this, arguments);
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

                return (0, _formatUrl).formatUrl(url);
            }

            var SP = typeof performance !== "undefined";
            exports.SP = SP;
            var ST =
                SP &&
                typeof performance.mark === "function" &&
                typeof performance.measure === "function";
            exports.ST = ST;

            var DecodeError = /*#__PURE__*/ (function (_Error) {
                _inherits(DecodeError, _Error);

                var _super = _createSuper(DecodeError);

                function DecodeError() {
                    _classCallCheck(this, DecodeError);

                    return _super.apply(this, arguments);
                }

                return DecodeError;
            })(/*#__PURE__*/ _wrapNativeSuper(Error));

            exports.DecodeError = DecodeError;

            /***/
        },

        /***/ 1474: /***/ function (module) {
            "use strict";

            var assign = Object.assign.bind(Object);
            module.exports = assign;
            module.exports.default = module.exports;

            //# sourceMappingURL=object-assign.js.map

            /***/
        },

        /***/ 5549: /***/ function (module) {
            var __dirname = "/";
            module.exports = (function () {
                var e = {
                    770: function (e, t) {
                        !(function (e, n) {
                            true ? n(t) : 0;
                        })(this, function (e) {
                            "use strict";
                            var t,
                                n,
                                i,
                                r,
                                a = function (e, t) {
                                    return {
                                        name: e,
                                        value: void 0 === t ? -1 : t,
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
                                    };
                                },
                                o = function (e, t) {
                                    try {
                                        if (
                                            PerformanceObserver.supportedEntryTypes.includes(
                                                e
                                            )
                                        ) {
                                            if (
                                                "first-input" === e &&
                                                !(
                                                    "PerformanceEventTiming" in
                                                    self
                                                )
                                            )
                                                return;
                                            var n = new PerformanceObserver(
                                                function (e) {
                                                    return e
                                                        .getEntries()
                                                        .map(t);
                                                }
                                            );
                                            return (
                                                n.observe({
                                                    type: e,
                                                    buffered: !0,
                                                }),
                                                n
                                            );
                                        }
                                    } catch (e) {}
                                },
                                u = function (e, t) {
                                    var i = function n(i) {
                                        ("pagehide" !== i.type &&
                                            "hidden" !==
                                                document.visibilityState) ||
                                            (e(i),
                                            t &&
                                                (removeEventListener(
                                                    "visibilitychange",
                                                    n,
                                                    !0
                                                ),
                                                removeEventListener(
                                                    "pagehide",
                                                    n,
                                                    !0
                                                )));
                                    };
                                    addEventListener("visibilitychange", i, !0),
                                        addEventListener("pagehide", i, !0);
                                },
                                c = function (e) {
                                    addEventListener(
                                        "pageshow",
                                        function (t) {
                                            t.persisted && e(t);
                                        },
                                        !0
                                    );
                                },
                                s = function (e, t, n) {
                                    var i;
                                    return function (r) {
                                        t.value >= 0 &&
                                            (r || n) &&
                                            ((t.delta = t.value - (i || 0)),
                                            (t.delta || void 0 === i) &&
                                                ((i = t.value), e(t)));
                                    };
                                },
                                f = -1,
                                v = function () {
                                    return "hidden" === document.visibilityState
                                        ? 0
                                        : 1 / 0;
                                },
                                m = function () {
                                    u(function (e) {
                                        var t = e.timeStamp;
                                        f = t;
                                    }, !0);
                                },
                                p = function () {
                                    return (
                                        f < 0 &&
                                            ((f = v()),
                                            m(),
                                            c(function () {
                                                setTimeout(function () {
                                                    (f = v()), m();
                                                }, 0);
                                            })),
                                        {
                                            get firstHiddenTime() {
                                                return f;
                                            },
                                        }
                                    );
                                },
                                d = function (e, t) {
                                    var n,
                                        i = p(),
                                        r = a("FCP"),
                                        u = function (e) {
                                            "first-contentful-paint" ===
                                                e.name &&
                                                (v && v.disconnect(),
                                                e.startTime <
                                                    i.firstHiddenTime &&
                                                    ((r.value = e.startTime),
                                                    r.entries.push(e),
                                                    n(!0)));
                                        },
                                        f =
                                            performance.getEntriesByName &&
                                            performance.getEntriesByName(
                                                "first-contentful-paint"
                                            )[0],
                                        v = f ? null : o("paint", u);
                                    (f || v) &&
                                        ((n = s(e, r, t)),
                                        f && u(f),
                                        c(function (i) {
                                            (r = a("FCP")),
                                                (n = s(e, r, t)),
                                                requestAnimationFrame(
                                                    function () {
                                                        requestAnimationFrame(
                                                            function () {
                                                                (r.value =
                                                                    performance.now() -
                                                                    i.timeStamp),
                                                                    n(!0);
                                                            }
                                                        );
                                                    }
                                                );
                                        }));
                                },
                                l = !1,
                                g = -1,
                                h = {
                                    passive: !0,
                                    capture: !0,
                                },
                                y = new Date(),
                                T = function (e, r) {
                                    t ||
                                        ((t = r),
                                        (n = e),
                                        (i = new Date()),
                                        w(removeEventListener),
                                        _());
                                },
                                _ = function () {
                                    if (n >= 0 && n < i - y) {
                                        var e = {
                                            entryType: "first-input",
                                            name: t.type,
                                            target: t.target,
                                            cancelable: t.cancelable,
                                            startTime: t.timeStamp,
                                            processingStart: t.timeStamp + n,
                                        };
                                        r.forEach(function (t) {
                                            t(e);
                                        }),
                                            (r = []);
                                    }
                                },
                                E = function (e) {
                                    if (e.cancelable) {
                                        var t =
                                            (e.timeStamp > 1e12
                                                ? new Date()
                                                : performance.now()) -
                                            e.timeStamp;
                                        "pointerdown" == e.type
                                            ? (function (e, t) {
                                                  var n = function () {
                                                          T(e, t), r();
                                                      },
                                                      i = function () {
                                                          r();
                                                      },
                                                      r = function () {
                                                          removeEventListener(
                                                              "pointerup",
                                                              n,
                                                              h
                                                          ),
                                                              removeEventListener(
                                                                  "pointercancel",
                                                                  i,
                                                                  h
                                                              );
                                                      };
                                                  addEventListener(
                                                      "pointerup",
                                                      n,
                                                      h
                                                  ),
                                                      addEventListener(
                                                          "pointercancel",
                                                          i,
                                                          h
                                                      );
                                              })(t, e)
                                            : T(t, e);
                                    }
                                },
                                w = function (e) {
                                    [
                                        "mousedown",
                                        "keydown",
                                        "touchstart",
                                        "pointerdown",
                                    ].forEach(function (t) {
                                        return e(t, E, h);
                                    });
                                },
                                S = new Set();
                            (e.getCLS = function (e, t) {
                                l ||
                                    (d(function (e) {
                                        g = e.value;
                                    }),
                                    (l = !0));
                                var n,
                                    i = function (t) {
                                        g > -1 && e(t);
                                    },
                                    r = a("CLS", 0),
                                    f = 0,
                                    v = [],
                                    m = function (e) {
                                        if (!e.hadRecentInput) {
                                            var t = v[0],
                                                i = v[v.length - 1];
                                            f &&
                                            e.startTime - i.startTime < 1e3 &&
                                            e.startTime - t.startTime < 5e3
                                                ? ((f += e.value), v.push(e))
                                                : ((f = e.value), (v = [e])),
                                                f > r.value &&
                                                    ((r.value = f),
                                                    (r.entries = v),
                                                    n());
                                        }
                                    },
                                    p = o("layout-shift", m);
                                p &&
                                    ((n = s(i, r, t)),
                                    u(function () {
                                        p.takeRecords().map(m), n(!0);
                                    }),
                                    c(function () {
                                        (f = 0),
                                            (g = -1),
                                            (r = a("CLS", 0)),
                                            (n = s(i, r, t));
                                    }));
                            }),
                                (e.getFCP = d),
                                (e.getFID = function (e, i) {
                                    var f,
                                        v = p(),
                                        m = a("FID"),
                                        d = function (e) {
                                            e.startTime < v.firstHiddenTime &&
                                                ((m.value =
                                                    e.processingStart -
                                                    e.startTime),
                                                m.entries.push(e),
                                                f(!0));
                                        },
                                        l = o("first-input", d);
                                    (f = s(e, m, i)),
                                        l &&
                                            u(function () {
                                                l.takeRecords().map(d),
                                                    l.disconnect();
                                            }, !0),
                                        l &&
                                            c(function () {
                                                var o;
                                                (m = a("FID")),
                                                    (f = s(e, m, i)),
                                                    (r = []),
                                                    (n = -1),
                                                    (t = null),
                                                    w(addEventListener),
                                                    (o = d),
                                                    r.push(o),
                                                    _();
                                            });
                                }),
                                (e.getLCP = function (e, t) {
                                    var n,
                                        i = p(),
                                        r = a("LCP"),
                                        f = function (e) {
                                            var t = e.startTime;
                                            t < i.firstHiddenTime &&
                                                ((r.value = t),
                                                r.entries.push(e)),
                                                n();
                                        },
                                        v = o("largest-contentful-paint", f);
                                    if (v) {
                                        n = s(e, r, t);
                                        var m = function () {
                                            S.has(r.id) ||
                                                (v.takeRecords().map(f),
                                                v.disconnect(),
                                                S.add(r.id),
                                                n(!0));
                                        };
                                        ["keydown", "click"].forEach(function (
                                            e
                                        ) {
                                            addEventListener(e, m, {
                                                once: !0,
                                                capture: !0,
                                            });
                                        }),
                                            u(m, !0),
                                            c(function (i) {
                                                (r = a("LCP")),
                                                    (n = s(e, r, t)),
                                                    requestAnimationFrame(
                                                        function () {
                                                            requestAnimationFrame(
                                                                function () {
                                                                    (r.value =
                                                                        performance.now() -
                                                                        i.timeStamp),
                                                                        S.add(
                                                                            r.id
                                                                        ),
                                                                        n(!0);
                                                                }
                                                            );
                                                        }
                                                    );
                                            });
                                    }
                                }),
                                (e.getTTFB = function (e) {
                                    var t,
                                        n = a("TTFB");
                                    (t = function () {
                                        try {
                                            var t =
                                                performance.getEntriesByType(
                                                    "navigation"
                                                )[0] ||
                                                (function () {
                                                    var e = performance.timing,
                                                        t = {
                                                            entryType:
                                                                "navigation",
                                                            startTime: 0,
                                                        };
                                                    for (var n in e)
                                                        "navigationStart" !==
                                                            n &&
                                                            "toJSON" !== n &&
                                                            (t[n] = Math.max(
                                                                e[n] -
                                                                    e.navigationStart,
                                                                0
                                                            ));
                                                    return t;
                                                })();
                                            if (
                                                ((n.value = n.delta =
                                                    t.responseStart),
                                                n.value < 0)
                                            )
                                                return;
                                            (n.entries = [t]), e(n);
                                        } catch (e) {}
                                    }),
                                        "complete" === document.readyState
                                            ? setTimeout(t, 0)
                                            : addEventListener("pageshow", t);
                                }),
                                Object.defineProperty(e, "__esModule", {
                                    value: !0,
                                });
                        });
                    },
                };
                var t = {};
                function __nccwpck_require__(n) {
                    if (t[n]) {
                        return t[n].exports;
                    }
                    var i = (t[n] = {
                        exports: {},
                    });
                    var r = true;
                    try {
                        e[n].call(i.exports, i, i.exports, __nccwpck_require__);
                        r = false;
                    } finally {
                        if (r) delete t[n];
                    }
                    return i.exports;
                }
                __nccwpck_require__.ab = __dirname + "/";
                return __nccwpck_require__(770);
            })();

            /***/
        },

        /***/ 709: /***/ function (__unused_webpack_module, exports) {
            "use strict";

            Object.defineProperty(exports, "__esModule", {
                value: true,
            });
            exports.normalizePathSep = normalizePathSep;
            exports.denormalizePagePath = denormalizePagePath;
            function normalizePathSep(path) {
                return path.replace(/\\/g, "/");
            }
            function denormalizePagePath(page) {
                page = normalizePathSep(page);
                if (page.startsWith("/index/")) {
                    page = page.slice(6);
                } else if (page === "/index") {
                    page = "/";
                }
                return page;
            }

            //# sourceMappingURL=denormalize-page-path.js.map

            /***/
        },

        /***/ 808: /***/ function () {
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
            return __webpack_exec__(5079);
        });
        /******/ var __webpack_exports__ = __webpack_require__.O();
        /******/ _N_E = __webpack_exports__;
        /******/
    },
]);
