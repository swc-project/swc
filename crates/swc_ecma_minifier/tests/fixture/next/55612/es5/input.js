function _assert_this_initialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
function _check_private_redeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _class_apply_descriptor_get(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
}
function _class_apply_descriptor_set(receiver, descriptor, value) {
    if (descriptor.set) {
        descriptor.set.call(receiver, value);
    } else {
        if (!descriptor.writable) {
            throw new TypeError("attempted to set read only private field");
        }
        descriptor.value = value;
    }
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _class_extract_field_descriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
}
function _class_private_field_get(receiver, privateMap) {
    var descriptor = _class_extract_field_descriptor(receiver, privateMap, "get");
    return _class_apply_descriptor_get(receiver, descriptor);
}
function _class_private_field_init(obj, privateMap, value) {
    _check_private_redeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _class_private_field_set(receiver, privateMap, value) {
    var descriptor = _class_extract_field_descriptor(receiver, privateMap, "set");
    _class_apply_descriptor_set(receiver, descriptor, value);
    return value;
}
function _construct(Parent, args, Class) {
    if (_is_native_reflect_construct()) {
        _construct = Reflect.construct;
    } else {
        _construct = function construct(Parent, args, Class) {
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) _set_prototype_of(instance, Class.prototype);
            return instance;
        };
    }
    return _construct.apply(null, arguments);
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
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _get_prototype_of(o) {
    _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _get_prototype_of(o);
}
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    if (superClass) _set_prototype_of(subClass, superClass);
}
function _is_native_function(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _possible_constructor_return(self, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) {
        return call;
    }
    return _assert_this_initialized(self);
}
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _wrap_native_super(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    _wrap_native_super = function wrapNativeSuper(Class) {
        if (Class === null || !_is_native_function(Class)) return Class;
        if (typeof Class !== "function") {
            throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
            if (_cache.has(Class)) return _cache.get(Class);
            _cache.set(Class, Wrapper);
        }
        function Wrapper() {
            return _construct(Class, arguments, _get_prototype_of(this).constructor);
        }
        Wrapper.prototype = Object.create(Class.prototype, {
            constructor: {
                value: Wrapper,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        return _set_prototype_of(Wrapper, Class);
    };
    return _wrap_native_super(Class);
}
function _is_native_reflect_construct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () { }));
        return true;
    } catch (e) {
        return false;
    }
}
function _create_super(Derived) {
    var hasNativeReflectConstruct = _is_native_reflect_construct();
    return function _createSuperInternal() {
        var Super = _get_prototype_of(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = _get_prototype_of(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return _possible_constructor_return(this, result);
    };
}
export var CancelError = /*#__PURE__*/ function (Error1) {
    "use strict";
    _inherits(CancelError, Error1);
    var _super = _create_super(CancelError);
    function CancelError(message) {
        _class_call_check(this, CancelError);
        var _this;
        _this = _super.call(this, message);
        _this.name = "CancelError";
        return _this;
    }
    _create_class(CancelError, [
        {
            key: "isCancelled",
            get: function get() {
                return true;
            }
        }
    ]);
    return CancelError;
}(_wrap_native_super(Error));
var _isResolved = /*#__PURE__*/ new WeakMap(), _isRejected = /*#__PURE__*/ new WeakMap(), _isCancelled = /*#__PURE__*/ new WeakMap(), _cancelHandlers = /*#__PURE__*/ new WeakMap(), _promise = /*#__PURE__*/ new WeakMap(), _resolve = /*#__PURE__*/ new WeakMap(), _reject = /*#__PURE__*/ new WeakMap();
var _Symbol_toStringTag = Symbol.toStringTag;
export var CancelablePromise = /*#__PURE__*/ function () {
    "use strict";
    function CancelablePromise(executor) {
        var _this = this;
        _class_call_check(this, CancelablePromise);
        _class_private_field_init(this, _isResolved, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _isRejected, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _isCancelled, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _cancelHandlers, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _promise, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _resolve, {
            writable: true,
            value: void 0
        });
        _class_private_field_init(this, _reject, {
            writable: true,
            value: void 0
        });
        _class_private_field_set(this, _isResolved, false);
        _class_private_field_set(this, _isRejected, false);
        _class_private_field_set(this, _isCancelled, false);
        _class_private_field_set(this, _cancelHandlers, []);
        _class_private_field_set(this, _promise, new Promise(function (resolve, reject) {
            _class_private_field_set(_this, _resolve, resolve);
            _class_private_field_set(_this, _reject, reject);
            var onResolve = function (value) {
                var _$_class_private_field_get;
                if (_class_private_field_get(_this, _isResolved) || _class_private_field_get(_this, _isRejected) || _class_private_field_get(_this, _isCancelled)) {
                    return;
                }
                _class_private_field_set(_this, _isResolved, true);
                (_$_class_private_field_get = _class_private_field_get(_this, _resolve)) === null || _$_class_private_field_get === void 0 ? void 0 : _$_class_private_field_get.call(_this, value);
            };
            var onReject = function (reason) {
                var _$_class_private_field_get;
                if (_class_private_field_get(_this, _isResolved) || _class_private_field_get(_this, _isRejected) || _class_private_field_get(_this, _isCancelled)) {
                    return;
                }
                _class_private_field_set(_this, _isRejected, true);
                (_$_class_private_field_get = _class_private_field_get(_this, _reject)) === null || _$_class_private_field_get === void 0 ? void 0 : _$_class_private_field_get.call(_this, reason);
            };
            var onCancel = function (cancelHandler) {
                if (_class_private_field_get(_this, _isResolved) || _class_private_field_get(_this, _isRejected) || _class_private_field_get(_this, _isCancelled)) {
                    return;
                }
                _class_private_field_get(_this, _cancelHandlers).push(cancelHandler);
            };
            Object.defineProperty(onCancel, "isResolved", {
                get: function () {
                    return _class_private_field_get(_this, _isResolved);
                }
            });
            Object.defineProperty(onCancel, "isRejected", {
                get: function () {
                    return _class_private_field_get(_this, _isRejected);
                }
            });
            Object.defineProperty(onCancel, "isCancelled", {
                get: function () {
                    return _class_private_field_get(_this, _isCancelled);
                }
            });
            return executor(onResolve, onReject, onCancel);
        }));
    }
    _create_class(CancelablePromise, [
        {
            key: _Symbol_toStringTag,
            get: function get() {
                return "Cancellable Promise";
            }
        },
        {
            key: "then",
            value: function then(onFulfilled, onRejected) {
                return _class_private_field_get(this, _promise).then(onFulfilled, onRejected);
            }
        },
        {
            key: "catch",
            value: function _catch(onRejected) {
                return _class_private_field_get(this, _promise).catch(onRejected);
            }
        },
        {
            key: "finally",
            value: function _finally(onFinally) {
                return _class_private_field_get(this, _promise).finally(onFinally);
            }
        },
        {
            key: "cancel",
            value: function cancel() {
                var _$_class_private_field_get;
                if (_class_private_field_get(this, _isResolved) || _class_private_field_get(this, _isRejected) || _class_private_field_get(this, _isCancelled)) {
                    return;
                }
                _class_private_field_set(this, _isCancelled, true);
                if (_class_private_field_get(this, _cancelHandlers).length) {
                    try {
                        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                        try {
                            for (var _iterator = _class_private_field_get(this, _cancelHandlers)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var cancelHandler = _step.value;
                                cancelHandler();
                            }
                        } catch (err) {
                            _didIteratorError = true;
                            _iteratorError = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion && _iterator.return != null) {
                                    _iterator.return();
                                }
                            } finally {
                                if (_didIteratorError) {
                                    throw _iteratorError;
                                }
                            }
                        }
                    } catch (error) {
                        console.warn("Cancellation threw an error", error);
                        return;
                    }
                }
                _class_private_field_get(this, _cancelHandlers).length = 0;
                (_$_class_private_field_get = _class_private_field_get(this, _reject)) === null || _$_class_private_field_get === void 0 ? void 0 : _$_class_private_field_get.call(this, new CancelError("Request aborted"));
            }
        },
        {
            key: "isCancelled",
            get: function get() {
                return _class_private_field_get(this, _isCancelled);
            }
        }
    ]);
    return CancelablePromise;
}();
