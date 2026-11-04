function _assert_this_initialized(self) {
    if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return self;
}
function _call_super(_this, derived, args) {
    derived = _get_prototype_of(derived);
    return _possible_constructor_return(_this, _is_native_reflect_construct() ? Reflect.construct(derived, args || [], _get_prototype_of(_this).constructor) : derived.apply(_this, args));
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
}
function _construct(Parent, args, Class) {
    if (_is_native_reflect_construct()) _construct = Reflect.construct;
    else {
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
    for(var i = 0; i < props.length; i++){
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
function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) _get = Reflect.get;
    else {
        _get = function get(target, property, receiver) {
            var base = _super_prop_base(target, property);
            if (!base) return;
            var desc = Object.getOwnPropertyDescriptor(base, property);
            if (desc.get) return desc.get.call(receiver || target);
            return desc.value;
        };
    }
    return _get(target, property, receiver || target);
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
function _instanceof(left, right) {
    "@swc/helpers - instanceof";
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else return left instanceof right;
}
function _is_native_function(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
}
function _is_native_reflect_construct() {
    try {
        var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
    } catch (_) {}
    return (_is_native_reflect_construct = function() {
        return !!result;
    })();
}
function _possible_constructor_return(self, call) {
    if (call && (_type_of(call) === "object" || typeof call === "function")) return call;
    return _assert_this_initialized(self);
}
function _set_prototype_of(o, p) {
    _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    };
    return _set_prototype_of(o, p);
}
function _super_prop_base(object, property) {
    while(!Object.prototype.hasOwnProperty.call(object, property)){
        object = _get_prototype_of(object);
        if (object === null) break;
    }
    return object;
}
function _ts_generator(thisArg, body) {
    var f, y, t, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype), d = Object.defineProperty;
    return d(g, "next", {
        value: verb(0)
    }), d(g, "throw", {
        value: verb(1)
    }), d(g, "return", {
        value: verb(2)
    }), typeof Symbol === "function" && d(g, Symbol.iterator, {
        value: function() {
            return this;
        }
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
function _ts_values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) {
        return m.call(o);
    }
    if (o && typeof o.length === "number") {
        return {
            next: function() {
                if (o && i >= o.length) {
                    o = void 0;
                }
                return {
                    value: o && o[i++],
                    done: !o
                };
            }
        };
    }
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _wrap_native_super(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    _wrap_native_super = function(Class) {
        if (Class === null || !_is_native_function(Class)) return Class;
        if (typeof Class !== "function") throw new TypeError("Super expression must either be null or a function");
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
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assert, assertEquals } from "./test_util.ts";
unitTest(function urlSearchParamsInitString() {
    var init = "c=4&a=2&b=3&%C3%A1=1";
    var searchParams = new URLSearchParams(init);
    assert(init === searchParams.toString(), "The init query string does not match");
});
unitTest(function urlSearchParamsInitIterable() {
    var init = [
        [
            "a",
            "54"
        ],
        [
            "b",
            "true"
        ]
    ];
    var searchParams = new URLSearchParams(init);
    assertEquals(searchParams.toString(), "a=54&b=true");
});
unitTest(function urlSearchParamsInitRecord() {
    var init = {
        a: "54",
        b: "true"
    };
    var searchParams = new URLSearchParams(init);
    assertEquals(searchParams.toString(), "a=54&b=true");
});
unitTest(function urlSearchParamsInit() {
    var params1 = new URLSearchParams("a=b");
    assertEquals(params1.toString(), "a=b");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var params2 = new URLSearchParams(params1);
    assertEquals(params2.toString(), "a=b");
});
unitTest(function urlSearchParamsAppendSuccess() {
    var searchParams = new URLSearchParams();
    searchParams.append("a", "true");
    assertEquals(searchParams.toString(), "a=true");
});
unitTest(function urlSearchParamsDeleteSuccess() {
    var init = "a=54&b=true";
    var searchParams = new URLSearchParams(init);
    searchParams.delete("b");
    assertEquals(searchParams.toString(), "a=54");
});
unitTest(function urlSearchParamsGetAllSuccess() {
    var init = "a=54&b=true&a=true";
    var searchParams = new URLSearchParams(init);
    assertEquals(searchParams.getAll("a"), [
        "54",
        "true"
    ]);
    assertEquals(searchParams.getAll("b"), [
        "true"
    ]);
    assertEquals(searchParams.getAll("c"), []);
});
unitTest(function urlSearchParamsGetSuccess() {
    var init = "a=54&b=true&a=true";
    var searchParams = new URLSearchParams(init);
    assertEquals(searchParams.get("a"), "54");
    assertEquals(searchParams.get("b"), "true");
    assertEquals(searchParams.get("c"), null);
});
unitTest(function urlSearchParamsHasSuccess() {
    var init = "a=54&b=true&a=true";
    var searchParams = new URLSearchParams(init);
    assert(searchParams.has("a"));
    assert(searchParams.has("b"));
    assert(!searchParams.has("c"));
});
unitTest(function urlSearchParamsSetReplaceFirstAndRemoveOthers() {
    var init = "a=54&b=true&a=true";
    var searchParams = new URLSearchParams(init);
    searchParams.set("a", "false");
    assertEquals(searchParams.toString(), "a=false&b=true");
});
unitTest(function urlSearchParamsSetAppendNew() {
    var init = "a=54&b=true&a=true";
    var searchParams = new URLSearchParams(init);
    searchParams.set("c", "foo");
    assertEquals(searchParams.toString(), "a=54&b=true&a=true&c=foo");
});
unitTest(function urlSearchParamsSortSuccess() {
    var init = "c=4&a=2&b=3&a=1";
    var searchParams = new URLSearchParams(init);
    searchParams.sort();
    assertEquals(searchParams.toString(), "a=2&a=1&b=3&c=4");
});
unitTest(function urlSearchParamsForEachSuccess() {
    var init = [
        [
            "a",
            "54"
        ],
        [
            "b",
            "true"
        ]
    ];
    var searchParams = new URLSearchParams(init);
    var callNum = 0;
    searchParams.forEach(function(value, key, parent) {
        assertEquals(searchParams, parent);
        assertEquals(value, init[callNum][1]);
        assertEquals(key, init[callNum][0]);
        callNum++;
    });
    assertEquals(callNum, init.length);
});
unitTest(function urlSearchParamsMissingName() {
    var init = "=4";
    var searchParams = new URLSearchParams(init);
    assertEquals(searchParams.get(""), "4");
    assertEquals(searchParams.toString(), "=4");
});
unitTest(function urlSearchParamsMissingValue() {
    var init = "4=";
    var searchParams = new URLSearchParams(init);
    assertEquals(searchParams.get("4"), "");
    assertEquals(searchParams.toString(), "4=");
});
unitTest(function urlSearchParamsMissingEqualSign() {
    var init = "4";
    var searchParams = new URLSearchParams(init);
    assertEquals(searchParams.get("4"), "");
    assertEquals(searchParams.toString(), "4=");
});
unitTest(function urlSearchParamsMissingPair() {
    var init = "c=4&&a=54&";
    var searchParams = new URLSearchParams(init);
    assertEquals(searchParams.toString(), "c=4&a=54");
});
// If pair does not contain exactly two items, then throw a TypeError.
// ref https://url.spec.whatwg.org/#interface-urlsearchparams
unitTest(function urlSearchParamsShouldThrowTypeError() {
    var hasThrown = 0;
    try {
        new URLSearchParams([
            [
                "1"
            ]
        ]);
        hasThrown = 1;
    } catch (err) {
        if (_instanceof(err, TypeError)) {
            hasThrown = 2;
        } else {
            hasThrown = 3;
        }
    }
    assertEquals(hasThrown, 2);
    try {
        new URLSearchParams([
            [
                "1",
                "2",
                "3"
            ]
        ]);
        hasThrown = 1;
    } catch (err) {
        if (_instanceof(err, TypeError)) {
            hasThrown = 2;
        } else {
            hasThrown = 3;
        }
    }
    assertEquals(hasThrown, 2);
});
unitTest(function urlSearchParamsAppendArgumentsCheck() {
    var methodRequireOneParam = [
        "delete",
        "getAll",
        "get",
        "has",
        "forEach"
    ];
    var methodRequireTwoParams = [
        "append",
        "set"
    ];
    methodRequireOneParam.concat(methodRequireTwoParams).forEach(function(method) {
        var searchParams = new URLSearchParams();
        var hasThrown = 0;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            searchParams[method]();
            hasThrown = 1;
        } catch (err) {
            if (_instanceof(err, TypeError)) {
                hasThrown = 2;
            } else {
                hasThrown = 3;
            }
        }
        assertEquals(hasThrown, 2);
    });
    methodRequireTwoParams.forEach(function(method) {
        var searchParams = new URLSearchParams();
        var hasThrown = 0;
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            searchParams[method]("foo");
            hasThrown = 1;
        } catch (err) {
            if (_instanceof(err, TypeError)) {
                hasThrown = 2;
            } else {
                hasThrown = 3;
            }
        }
        assertEquals(hasThrown, 2);
    });
});
// ref: https://github.com/web-platform-tests/wpt/blob/master/url/urlsearchparams-delete.any.js
unitTest(function urlSearchParamsDeletingAppendedMultiple() {
    var params = new URLSearchParams();
    params.append("first", 1);
    assert(params.has("first"));
    assertEquals(params.get("first"), "1");
    params.delete("first");
    assertEquals(params.has("first"), false);
    params.append("first", 1);
    params.append("first", 10);
    params.delete("first");
    assertEquals(params.has("first"), false);
});
// ref: https://github.com/web-platform-tests/wpt/blob/master/url/urlsearchparams-constructor.any.js#L176-L182
unitTest(function urlSearchParamsCustomSymbolIterator() {
    var params = new URLSearchParams();
    params[Symbol.iterator] = function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        [
                            "a",
                            "b"
                        ]
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    };
    var params1 = new URLSearchParams(params);
    assertEquals(params1.get("a"), "b");
});
unitTest(function urlSearchParamsCustomSymbolIteratorWithNonStringParams() {
    var params = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params[Symbol.iterator] = function() {
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        [
                            1,
                            2
                        ]
                    ];
                case 1:
                    _state.sent();
                    return [
                        2
                    ];
            }
        });
    };
    var params1 = new URLSearchParams(params);
    assertEquals(params1.get("1"), "2");
});
// If a class extends URLSearchParams, override one method should not change another's behavior.
unitTest(function urlSearchParamsOverridingAppendNotChangeConstructorAndSet() {
    var overridedAppendCalled = 0;
    var CustomSearchParams = /*#__PURE__*/ function(URLSearchParams1) {
        "use strict";
        _inherits(CustomSearchParams, URLSearchParams1);
        function CustomSearchParams() {
            _class_call_check(this, CustomSearchParams);
            return _call_super(this, CustomSearchParams, arguments);
        }
        _create_class(CustomSearchParams, [
            {
                key: "append",
                value: function append(name, value) {
                    ++overridedAppendCalled;
                    _get(_get_prototype_of(CustomSearchParams.prototype), "append", this).call(this, name, value);
                }
            }
        ]);
        return CustomSearchParams;
    }(_wrap_native_super(URLSearchParams));
    new CustomSearchParams("foo=bar");
    new CustomSearchParams([
        [
            "foo",
            "bar"
        ]
    ]);
    new CustomSearchParams(new CustomSearchParams({
        foo: "bar"
    }));
    new CustomSearchParams().set("foo", "bar");
    assertEquals(overridedAppendCalled, 0);
});
unitTest(function urlSearchParamsOverridingEntriesNotChangeForEach() {
    var CustomSearchParams = /*#__PURE__*/ function(URLSearchParams1) {
        "use strict";
        _inherits(CustomSearchParams, URLSearchParams1);
        function CustomSearchParams() {
            _class_call_check(this, CustomSearchParams);
            return _call_super(this, CustomSearchParams, arguments);
        }
        _create_class(CustomSearchParams, [
            {
                key: "entries",
                value: function entries() {
                    return _ts_generator(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                return [
                                    5,
                                    _ts_values([])
                                ];
                            case 1:
                                _state.sent();
                                return [
                                    2
                                ];
                        }
                    });
                }
            }
        ]);
        return CustomSearchParams;
    }(_wrap_native_super(URLSearchParams));
    var loopCount = 0;
    var params = new CustomSearchParams({
        foo: "bar"
    });
    params.forEach(function() {
        return void ++loopCount;
    });
    assertEquals(loopCount, 1);
});
