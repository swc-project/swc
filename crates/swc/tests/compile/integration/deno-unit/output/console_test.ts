function _assert_this_initialized(self) {
    if (self === void 0) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return self;
}
function _async_generator(gen) {
    var front, back;
    function send(key, arg) {
        return new Promise(function(resolve, reject) {
            var request = {
                key: key,
                arg: arg,
                resolve: resolve,
                reject: reject,
                next: null
            };
            if (back) back = back.next = request;
            else {
                front = back = request;
                resume(key, arg);
            }
        });
    }
    function resume(key, arg) {
        try {
            var result = gen[key](arg);
            var value = result.value;
            var overloaded = value instanceof _overload_yield;
            Promise.resolve(overloaded ? value.v : value).then(function(arg) {
                if (overloaded) {
                    var nextKey = key === "return" ? "return" : "next";
                    if (!value.k || arg.done) return resume(nextKey, arg);
                    else arg = gen[nextKey](arg).value;
                }
                settle(result.done ? "return" : "normal", arg);
            }, function(err) {
                resume("throw", err);
            });
        } catch (err) {
            settle("throw", err);
        }
    }
    function settle(type, value) {
        switch(type){
            case "return":
                front.resolve({
                    value: value,
                    done: true
                });
                break;
            case "throw":
                front.reject(value);
                break;
            default:
                front.resolve({
                    value: value,
                    done: false
                });
                break;
        }
        front = front.next;
        if (front) resume(front.key, front.arg);
        else back = null;
    }
    this._invoke = send;
    if (typeof gen.return !== "function") this.return = undefined;
}
_async_generator.prototype[typeof Symbol === "function" && Symbol.asyncIterator || "@@asyncIterator"] = function() {
    return this;
};
_async_generator.prototype.next = function(arg) {
    return this._invoke("next", arg);
};
_async_generator.prototype.throw = function(arg) {
    return this._invoke("throw", arg);
};
_async_generator.prototype.return = function(arg) {
    return this._invoke("return", arg);
};
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) resolve(value);
    else Promise.resolve(value).then(_next, _throw);
}
function _async_to_generator(fn) {
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
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else obj[key] = value;
    return obj;
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
function _overload_yield(value, kind) {
    this.v = value;
    this.k = kind;
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
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _wrap_async_generator(fn) {
    return function() {
        return new _async_generator(fn.apply(this, arguments));
    };
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
// TODO(ry) The unit test functions in this module are too coarse. They should
// be broken up into smaller bits.
// TODO(ry) These tests currentl strip all the ANSI colors out. We don't have a
// good way to control whether we produce color output or not since
// std/fmt/colors auto determines whether to put colors in or not. We need
// better infrastructure here so we can properly test the colors.
import { assert, assertEquals, unitTest } from "./test_util.ts";
import { stripColor } from "../../../std/fmt/colors.ts";
// Some of these APIs aren't exposed in the types and so we have to cast to any
// in order to "trick" TypeScript.
var inspect = Deno.inspect;
var customInspect = Deno.customInspect;
var _Deno_Deno_internal = Deno[Deno.internal], Console = _Deno_Deno_internal.Console, stringifyArgs = _Deno_Deno_internal.stringifyArgs;
function stringify() {
    for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
        args[_key] = arguments[_key];
    }
    return stripColor(stringifyArgs(args).replace(/\n$/, ""));
}
// test cases from web-platform-tests
// via https://github.com/web-platform-tests/wpt/blob/master/console/console-is-a-namespace.any.js
unitTest(function consoleShouldBeANamespace() {
    var prototype1 = Object.getPrototypeOf(console);
    var prototype2 = Object.getPrototypeOf(prototype1);
    assertEquals(Object.getOwnPropertyNames(prototype1).length, 0);
    assertEquals(prototype2, Object.prototype);
});
unitTest(function consoleHasRightInstance() {
    assert(_instanceof(console, Console));
    assertEquals(_instanceof({}, Console), false);
});
unitTest(function consoleTestAssertShouldNotThrowError() {
    mockConsole(function(console1) {
        console1.assert(true);
        var hasThrown = undefined;
        try {
            console1.assert(false);
            hasThrown = false;
        } catch (unused) {
            hasThrown = true;
        }
        assertEquals(hasThrown, false);
    });
});
unitTest(function consoleTestStringifyComplexObjects() {
    assertEquals(stringify("foo"), "foo");
    assertEquals(stringify([
        "foo",
        "bar"
    ]), '[ "foo", "bar" ]');
    assertEquals(stringify({
        foo: "bar"
    }), '{ foo: "bar" }');
});
unitTest(function consoleTestStringifyQuotes() {
    assertEquals(stringify([
        "\\"
    ]), '[ "\\\\" ]');
    assertEquals(stringify([
        '\\,"'
    ]), "[ '\\\\,\"' ]");
    assertEquals(stringify([
        "\\,\",'"
    ]), "[ `\\\\,\",'` ]");
    assertEquals(stringify([
        "\\,\",',`"
    ]), '[ "\\\\,\\",\',`" ]');
});
unitTest(function consoleTestStringifyLongStrings() {
    var veryLongString = "a".repeat(200);
    // If we stringify an object containing the long string, it gets abbreviated.
    var actual = stringify({
        veryLongString: veryLongString
    });
    assert(actual.includes("..."));
    assert(actual.length < 200);
    // However if we stringify the string itself, we get it exactly.
    actual = stringify(veryLongString);
    assertEquals(actual, veryLongString);
});
/* eslint-disable @typescript-eslint/explicit-function-return-type */ unitTest(function consoleTestStringifyCircular() {
    var Base = /*#__PURE__*/ function() {
        "use strict";
        function Base() {
            _class_call_check(this, Base);
            _define_property(this, "a", 1);
        }
        _create_class(Base, [
            {
                key: "m1",
                value: function m1() {}
            }
        ]);
        return Base;
    }();
    var Extended = /*#__PURE__*/ function(Base) {
        "use strict";
        _inherits(Extended, Base);
        function Extended() {
            _class_call_check(this, Extended);
            var _this;
            _this = _call_super(this, Extended, arguments), _define_property(_this, "b", 2);
            return _this;
        }
        _create_class(Extended, [
            {
                key: "m2",
                value: function m2() {}
            }
        ]);
        return Extended;
    }(Base);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var nestedObj = {
        num: 1,
        bool: true,
        str: "a",
        method: function method() {},
        asyncMethod: function asyncMethod() {
            return _async_to_generator(function() {
                return _ts_generator(this, function(_state) {
                    return [
                        2
                    ];
                });
            })();
        },
        generatorMethod: function generatorMethod() {
            return _ts_generator(this, function(_state) {
                return [
                    2
                ];
            });
        },
        un: undefined,
        nu: null,
        arrowFunc: function arrowFunc() {},
        extendedClass: new Extended(),
        nFunc: new Function(),
        extendedCstr: Extended
    };
    var circularObj = {
        num: 2,
        bool: false,
        str: "b",
        method: function method() {},
        un: undefined,
        nu: null,
        nested: nestedObj,
        emptyObj: {},
        arr: [
            1,
            "s",
            false,
            null,
            nestedObj
        ],
        baseClass: new Base()
    };
    nestedObj.o = circularObj;
    var nestedObjExpected = '{\n  num: 1,\n  bool: true,\n  str: "a",\n  method: [Function: method],\n  asyncMethod: [AsyncFunction: asyncMethod],\n  generatorMethod: [GeneratorFunction: generatorMethod],\n  un: undefined,\n  nu: null,\n  arrowFunc: [Function: arrowFunc],\n  extendedClass: Extended { a: 1, b: 2 },\n  nFunc: [Function],\n  extendedCstr: [Function: Extended],\n  o: {\n    num: 2,\n    bool: false,\n    str: "b",\n    method: [Function: method],\n    un: undefined,\n    nu: null,\n    nested: [Circular],\n    emptyObj: {},\n    arr: [ 1, "s", false, null, [Circular] ],\n    baseClass: Base { a: 1 }\n  }\n}';
    assertEquals(stringify(1), "1");
    assertEquals(stringify(-0), "-0");
    assertEquals(stringify(1n), "1n");
    assertEquals(stringify("s"), "s");
    assertEquals(stringify(false), "false");
    assertEquals(stringify(new Number(1)), "[Number: 1]");
    assertEquals(stringify(new Boolean(true)), "[Boolean: true]");
    assertEquals(stringify(new String("deno")), '[String: "deno"]');
    assertEquals(stringify(/[0-9]*/), "/[0-9]*/");
    assertEquals(stringify(new Date("2018-12-10T02:26:59.002Z")), "2018-12-10T02:26:59.002Z");
    assertEquals(stringify(new Set([
        1,
        2,
        3
    ])), "Set { 1, 2, 3 }");
    assertEquals(stringify(new Map([
        [
            1,
            "one"
        ],
        [
            2,
            "two"
        ]
    ])), 'Map { 1 => "one", 2 => "two" }');
    assertEquals(stringify(new WeakSet()), "WeakSet { [items unknown] }");
    assertEquals(stringify(new WeakMap()), "WeakMap { [items unknown] }");
    assertEquals(stringify(Symbol(1)), "Symbol(1)");
    assertEquals(stringify(null), "null");
    assertEquals(stringify(undefined), "undefined");
    assertEquals(stringify(new Extended()), "Extended { a: 1, b: 2 }");
    assertEquals(stringify(function f() {}), "[Function: f]");
    assertEquals(stringify(function af() {
        return _async_to_generator(function() {
            return _ts_generator(this, function(_state) {
                return [
                    2
                ];
            });
        })();
    }), "[AsyncFunction: af]");
    assertEquals(stringify(function gf() {
        return _ts_generator(this, function(_state) {
            return [
                2
            ];
        });
    }), "[GeneratorFunction: gf]");
    assertEquals(stringify(function agf() {
        return _wrap_async_generator(function() {
            return _ts_generator(this, function(_state) {
                return [
                    2
                ];
            });
        })();
    }), "[AsyncGeneratorFunction: agf]");
    assertEquals(stringify(new Uint8Array([
        1,
        2,
        3
    ])), "Uint8Array(3) [ 1, 2, 3 ]");
    assertEquals(stringify(Uint8Array.prototype), "TypedArray {}");
    assertEquals(stringify({
        a: {
            b: {
                c: {
                    d: new Set([
                        1
                    ])
                }
            }
        }
    }), "{ a: { b: { c: { d: [Set] } } } }");
    assertEquals(stringify(nestedObj), nestedObjExpected);
    assertEquals(stringify(JSON), 'JSON { Symbol(Symbol.toStringTag): "JSON" }');
    assertEquals(stringify(console), "{\n  log: [Function],\n  debug: [Function],\n  info: [Function],\n  dir: [Function],\n  dirxml: [Function],\n  warn: [Function],\n  error: [Function],\n  assert: [Function],\n  count: [Function],\n  countReset: [Function],\n  table: [Function],\n  time: [Function],\n  timeLog: [Function],\n  timeEnd: [Function],\n  group: [Function],\n  groupCollapsed: [Function],\n  groupEnd: [Function],\n  clear: [Function],\n  trace: [Function],\n  indentLevel: 0,\n  Symbol(isConsoleInstance): true\n}");
    var _obj;
    assertEquals(stringify((_obj = {
        str: 1
    }, _define_property(_obj, Symbol.for("sym"), 2), _define_property(_obj, Symbol.toStringTag, "TAG"), _obj)), 'TAG { str: 1, Symbol(sym): 2, Symbol(Symbol.toStringTag): "TAG" }');
    // test inspect is working the same
    assertEquals(stripColor(inspect(nestedObj)), nestedObjExpected);
});
/* eslint-enable @typescript-eslint/explicit-function-return-type */ unitTest(function consoleTestStringifyWithDepth() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var nestedObj = {
        a: {
            b: {
                c: {
                    d: {
                        e: {
                            f: 42
                        }
                    }
                }
            }
        }
    };
    assertEquals(stripColor(stringifyArgs([
        nestedObj
    ], {
        depth: 3
    })), "{ a: { b: { c: [Object] } } }");
    assertEquals(stripColor(stringifyArgs([
        nestedObj
    ], {
        depth: 4
    })), "{ a: { b: { c: { d: [Object] } } } }");
    assertEquals(stripColor(stringifyArgs([
        nestedObj
    ], {
        depth: 0
    })), "[Object]");
    assertEquals(stripColor(stringifyArgs([
        nestedObj
    ])), "{ a: { b: { c: { d: [Object] } } } }");
    // test inspect is working the same way
    assertEquals(stripColor(inspect(nestedObj, {
        depth: 4
    })), "{ a: { b: { c: { d: [Object] } } } }");
});
unitTest(function consoleTestStringifyLargeObject() {
    var obj = {
        a: 2,
        o: {
            a: "1",
            b: "2",
            c: "3",
            d: "4",
            e: "5",
            f: "6",
            g: 10,
            asd: 2,
            asda: 3,
            x: {
                a: "asd",
                x: 3
            }
        }
    };
    assertEquals(stringify(obj), '{\n  a: 2,\n  o: {\n    a: "1",\n    b: "2",\n    c: "3",\n    d: "4",\n    e: "5",\n    f: "6",\n    g: 10,\n    asd: 2,\n    asda: 3,\n    x: { a: "asd", x: 3 }\n  }\n}');
});
unitTest(function consoleTestStringifyIterable() {
    var shortArray = [
        1,
        2,
        3,
        4,
        5
    ];
    assertEquals(stringify(shortArray), "[ 1, 2, 3, 4, 5 ]");
    var longArray = new Array(200).fill(0);
    assertEquals(stringify(longArray), "[\n  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,\n  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,\n  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,\n  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,\n  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,\n  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,\n  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,\n  ... 100 more items\n]");
    var obj = {
        a: "a",
        longArray: longArray
    };
    assertEquals(stringify(obj), '{\n  a: "a",\n  longArray: [\n    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,\n    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,\n    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,\n    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,\n    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,\n    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,\n    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,\n    ... 100 more items\n  ]\n}');
    var shortMap = new Map([
        [
            "a",
            0
        ],
        [
            "b",
            1
        ]
    ]);
    assertEquals(stringify(shortMap), 'Map { "a" => 0, "b" => 1 }');
    var longMap = new Map();
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = Array(200).keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var key = _step.value;
            longMap.set("".concat(key), key);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    assertEquals(stringify(longMap), 'Map {\n  "0" => 0,\n  "1" => 1,\n  "2" => 2,\n  "3" => 3,\n  "4" => 4,\n  "5" => 5,\n  "6" => 6,\n  "7" => 7,\n  "8" => 8,\n  "9" => 9,\n  "10" => 10,\n  "11" => 11,\n  "12" => 12,\n  "13" => 13,\n  "14" => 14,\n  "15" => 15,\n  "16" => 16,\n  "17" => 17,\n  "18" => 18,\n  "19" => 19,\n  "20" => 20,\n  "21" => 21,\n  "22" => 22,\n  "23" => 23,\n  "24" => 24,\n  "25" => 25,\n  "26" => 26,\n  "27" => 27,\n  "28" => 28,\n  "29" => 29,\n  "30" => 30,\n  "31" => 31,\n  "32" => 32,\n  "33" => 33,\n  "34" => 34,\n  "35" => 35,\n  "36" => 36,\n  "37" => 37,\n  "38" => 38,\n  "39" => 39,\n  "40" => 40,\n  "41" => 41,\n  "42" => 42,\n  "43" => 43,\n  "44" => 44,\n  "45" => 45,\n  "46" => 46,\n  "47" => 47,\n  "48" => 48,\n  "49" => 49,\n  "50" => 50,\n  "51" => 51,\n  "52" => 52,\n  "53" => 53,\n  "54" => 54,\n  "55" => 55,\n  "56" => 56,\n  "57" => 57,\n  "58" => 58,\n  "59" => 59,\n  "60" => 60,\n  "61" => 61,\n  "62" => 62,\n  "63" => 63,\n  "64" => 64,\n  "65" => 65,\n  "66" => 66,\n  "67" => 67,\n  "68" => 68,\n  "69" => 69,\n  "70" => 70,\n  "71" => 71,\n  "72" => 72,\n  "73" => 73,\n  "74" => 74,\n  "75" => 75,\n  "76" => 76,\n  "77" => 77,\n  "78" => 78,\n  "79" => 79,\n  "80" => 80,\n  "81" => 81,\n  "82" => 82,\n  "83" => 83,\n  "84" => 84,\n  "85" => 85,\n  "86" => 86,\n  "87" => 87,\n  "88" => 88,\n  "89" => 89,\n  "90" => 90,\n  "91" => 91,\n  "92" => 92,\n  "93" => 93,\n  "94" => 94,\n  "95" => 95,\n  "96" => 96,\n  "97" => 97,\n  "98" => 98,\n  "99" => 99,\n  ... 100 more items\n}');
    var shortSet = new Set([
        1,
        2,
        3
    ]);
    assertEquals(stringify(shortSet), "Set { 1, 2, 3 }");
    var longSet = new Set();
    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
    try {
        for(var _iterator1 = Array(200).keys()[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
            var key1 = _step1.value;
            longSet.add(key1);
        }
    } catch (err) {
        _didIteratorError1 = true;
        _iteratorError1 = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                _iterator1.return();
            }
        } finally{
            if (_didIteratorError1) {
                throw _iteratorError1;
            }
        }
    }
    assertEquals(stringify(longSet), "Set {\n  0,\n  1,\n  2,\n  3,\n  4,\n  5,\n  6,\n  7,\n  8,\n  9,\n  10,\n  11,\n  12,\n  13,\n  14,\n  15,\n  16,\n  17,\n  18,\n  19,\n  20,\n  21,\n  22,\n  23,\n  24,\n  25,\n  26,\n  27,\n  28,\n  29,\n  30,\n  31,\n  32,\n  33,\n  34,\n  35,\n  36,\n  37,\n  38,\n  39,\n  40,\n  41,\n  42,\n  43,\n  44,\n  45,\n  46,\n  47,\n  48,\n  49,\n  50,\n  51,\n  52,\n  53,\n  54,\n  55,\n  56,\n  57,\n  58,\n  59,\n  60,\n  61,\n  62,\n  63,\n  64,\n  65,\n  66,\n  67,\n  68,\n  69,\n  70,\n  71,\n  72,\n  73,\n  74,\n  75,\n  76,\n  77,\n  78,\n  79,\n  80,\n  81,\n  82,\n  83,\n  84,\n  85,\n  86,\n  87,\n  88,\n  89,\n  90,\n  91,\n  92,\n  93,\n  94,\n  95,\n  96,\n  97,\n  98,\n  99,\n  ... 100 more items\n}");
    var withEmptyEl = Array(10);
    withEmptyEl.fill(0, 4, 6);
    assertEquals(stringify(withEmptyEl), "[ <4 empty items>, 0, 0, <4 empty items> ]");
/* TODO(ry) Fix this test
  const lWithEmptyEl = Array(200);
  lWithEmptyEl.fill(0, 50, 80);
  assertEquals(
    stringify(lWithEmptyEl),
    `[
  <50 empty items>, 0,                 0,
  0,                0,                 0,
  0,                0,                 0,
  0,                0,                 0,
  0,                0,                 0,
  0,                0,                 0,
  0,                0,                 0,
  0,                0,                 0,
  0,                0,                 0,
  0,                0,                 0,
  0,                <120 empty items>
]`
  );
  */ });
unitTest(function consoleTestStringifyPromises() {
    return _async_to_generator(function() {
        var pendingPromise, resolvedPromise, rejectedPromise, err, strLines;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    pendingPromise = new Promise(function(_res, _rej) {});
                    assertEquals(stringify(pendingPromise), "Promise { <pending> }");
                    resolvedPromise = new Promise(function(res, _rej) {
                        res("Resolved!");
                    });
                    assertEquals(stringify(resolvedPromise), 'Promise { "Resolved!" }');
                    _state.label = 1;
                case 1:
                    _state.trys.push([
                        1,
                        3,
                        ,
                        4
                    ]);
                    rejectedPromise = new Promise(function(_, rej) {
                        rej(Error("Whoops"));
                    });
                    return [
                        4,
                        rejectedPromise
                    ];
                case 2:
                    _state.sent();
                    return [
                        3,
                        4
                    ];
                case 3:
                    err = _state.sent();
                    return [
                        3,
                        4
                    ];
                case 4:
                    strLines = stringify(rejectedPromise).split("\n");
                    assertEquals(strLines[0], "Promise {");
                    assertEquals(strLines[1], "  <rejected> Error: Whoops");
                    return [
                        2
                    ];
            }
        });
    })();
});
unitTest(function consoleTestWithCustomInspector() {
    var A = /*#__PURE__*/ function() {
        "use strict";
        function A() {
            _class_call_check(this, A);
        }
        _create_class(A, [
            {
                key: customInspect,
                value: function value() {
                    return "b";
                }
            }
        ]);
        return A;
    }();
    assertEquals(stringify(new A()), "b");
});
unitTest(function consoleTestWithCustomInspectorError() {
    var A = /*#__PURE__*/ function() {
        "use strict";
        function A() {
            _class_call_check(this, A);
        }
        _create_class(A, [
            {
                key: customInspect,
                value: function value() {
                    throw new Error("BOOM");
                    return "b";
                }
            }
        ]);
        return A;
    }();
    assertEquals(stringify(new A()), "A {}");
    var _customInspect = customInspect;
    var B = /*#__PURE__*/ function() {
        "use strict";
        function B(field) {
            _class_call_check(this, B);
            _define_property(this, "field", void 0);
            this.field = field;
        }
        _create_class(B, [
            {
                key: _customInspect,
                value: function value() {
                    return this.field.a;
                }
            }
        ]);
        return B;
    }();
    assertEquals(stringify(new B({
        a: "a"
    })), "a");
    assertEquals(stringify(B.prototype), "{ Symbol(Deno.symbols.customInspect): [Function: [Deno.symbols.customInspect]] }");
});
unitTest(function consoleTestWithIntegerFormatSpecifier() {
    assertEquals(stringify("%i"), "%i");
    assertEquals(stringify("%i", 42.0), "42");
    assertEquals(stringify("%i", 42), "42");
    assertEquals(stringify("%i", "42"), "42");
    assertEquals(stringify("%i", "42.0"), "42");
    assertEquals(stringify("%i", 1.5), "1");
    assertEquals(stringify("%i", -0.5), "0");
    assertEquals(stringify("%i", ""), "NaN");
    assertEquals(stringify("%i", Symbol()), "NaN");
    assertEquals(stringify("%i %d", 42, 43), "42 43");
    assertEquals(stringify("%d %i", 42), "42 %i");
    assertEquals(stringify("%d", 12345678901234567890123), "1");
    assertEquals(stringify("%i", 12345678901234567890123n), "12345678901234567890123n");
});
unitTest(function consoleTestWithFloatFormatSpecifier() {
    assertEquals(stringify("%f"), "%f");
    assertEquals(stringify("%f", 42.0), "42");
    assertEquals(stringify("%f", 42), "42");
    assertEquals(stringify("%f", "42"), "42");
    assertEquals(stringify("%f", "42.0"), "42");
    assertEquals(stringify("%f", 1.5), "1.5");
    assertEquals(stringify("%f", -0.5), "-0.5");
    assertEquals(stringify("%f", Math.PI), "3.141592653589793");
    assertEquals(stringify("%f", ""), "NaN");
    assertEquals(stringify("%f", Symbol("foo")), "NaN");
    assertEquals(stringify("%f", 5n), "5");
    assertEquals(stringify("%f %f", 42, 43), "42 43");
    assertEquals(stringify("%f %f", 42), "42 %f");
});
unitTest(function consoleTestWithStringFormatSpecifier() {
    assertEquals(stringify("%s"), "%s");
    assertEquals(stringify("%s", undefined), "undefined");
    assertEquals(stringify("%s", "foo"), "foo");
    assertEquals(stringify("%s", 42), "42");
    assertEquals(stringify("%s", "42"), "42");
    assertEquals(stringify("%s %s", 42, 43), "42 43");
    assertEquals(stringify("%s %s", 42), "42 %s");
    assertEquals(stringify("%s", Symbol("foo")), "Symbol(foo)");
});
unitTest(function consoleTestWithObjectFormatSpecifier() {
    assertEquals(stringify("%o"), "%o");
    assertEquals(stringify("%o", 42), "42");
    assertEquals(stringify("%o", "foo"), "foo");
    assertEquals(stringify("o: %o, a: %O", {}, []), "o: {}, a: []");
    assertEquals(stringify("%o", {
        a: 42
    }), "{ a: 42 }");
    assertEquals(stringify("%o", {
        a: {
            b: {
                c: {
                    d: new Set([
                        1
                    ])
                }
            }
        }
    }), "{ a: { b: { c: { d: [Set] } } } }");
});
unitTest(function consoleTestWithVariousOrInvalidFormatSpecifier() {
    assertEquals(stringify("%s:%s"), "%s:%s");
    assertEquals(stringify("%i:%i"), "%i:%i");
    assertEquals(stringify("%d:%d"), "%d:%d");
    assertEquals(stringify("%%s%s", "foo"), "%sfoo");
    assertEquals(stringify("%s:%s", undefined), "undefined:%s");
    assertEquals(stringify("%s:%s", "foo", "bar"), "foo:bar");
    assertEquals(stringify("%s:%s", "foo", "bar", "baz"), "foo:bar baz");
    assertEquals(stringify("%%%s%%", "hi"), "%hi%");
    assertEquals(stringify("%d:%d", 12), "12:%d");
    assertEquals(stringify("%i:%i", 12), "12:%i");
    assertEquals(stringify("%f:%f", 12), "12:%f");
    assertEquals(stringify("o: %o, a: %o", {}), "o: {}, a: %o");
    assertEquals(stringify("abc%", 1), "abc% 1");
});
unitTest(function consoleTestCallToStringOnLabel() {
    var methods = [
        "count",
        "countReset",
        "time",
        "timeLog",
        "timeEnd"
    ];
    mockConsole(function(console1) {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            var _loop = function() {
                var method = _step.value;
                var hasCalled = false;
                console1[method]({
                    toString: function toString() {
                        hasCalled = true;
                    }
                });
                assertEquals(hasCalled, true);
            };
            for(var _iterator = methods[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_loop();
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    });
});
unitTest(function consoleTestError() {
    var MyError = /*#__PURE__*/ function(Error1) {
        "use strict";
        _inherits(MyError, Error1);
        function MyError(errStr) {
            _class_call_check(this, MyError);
            var _this;
            _this = _call_super(this, MyError, [
                errStr
            ]);
            _this.name = "MyError";
            return _this;
        }
        return MyError;
    }(_wrap_native_super(Error));
    try {
        throw new MyError("This is an error");
    } catch (e) {
        assert(stringify(e).split("\n")[0] // error has been caught
        .includes("MyError: This is an error"));
    }
});
unitTest(function consoleTestClear() {
    mockConsole(function(console1, out) {
        console1.clear();
        assertEquals(out.toString(), "\x1b[1;1H" + "\x1b[0J");
    });
});
// Test bound this issue
unitTest(function consoleDetachedLog() {
    mockConsole(function(console1) {
        var log = console1.log;
        var dir = console1.dir;
        var dirxml = console1.dirxml;
        var debug = console1.debug;
        var info = console1.info;
        var warn = console1.warn;
        var error = console1.error;
        var consoleAssert = console1.assert;
        var consoleCount = console1.count;
        var consoleCountReset = console1.countReset;
        var consoleTable = console1.table;
        var consoleTime = console1.time;
        var consoleTimeLog = console1.timeLog;
        var consoleTimeEnd = console1.timeEnd;
        var consoleGroup = console1.group;
        var consoleGroupEnd = console1.groupEnd;
        var consoleClear = console1.clear;
        log("Hello world");
        dir("Hello world");
        dirxml("Hello world");
        debug("Hello world");
        info("Hello world");
        warn("Hello world");
        error("Hello world");
        consoleAssert(true);
        consoleCount("Hello world");
        consoleCountReset("Hello world");
        consoleTable({
            test: "Hello world"
        });
        consoleTime("Hello world");
        consoleTimeLog("Hello world");
        consoleTimeEnd("Hello world");
        consoleGroup("Hello world");
        consoleGroupEnd();
        consoleClear();
    });
});
var StringBuffer = /*#__PURE__*/ function() {
    "use strict";
    function StringBuffer() {
        _class_call_check(this, StringBuffer);
        _define_property(this, "chunks", []);
    }
    _create_class(StringBuffer, [
        {
            key: "add",
            value: function add(x) {
                this.chunks.push(x);
            }
        },
        {
            key: "toString",
            value: function toString() {
                return this.chunks.join("");
            }
        }
    ]);
    return StringBuffer;
}();
function mockConsole(f) {
    var out = new StringBuffer();
    var err = new StringBuffer();
    var both = new StringBuffer();
    var csl = new Console(function(x, isErr, printsNewLine) {
        var content = x + (printsNewLine ? "\n" : "");
        var buf = isErr ? err : out;
        buf.add(content);
        both.add(content);
    });
    f(csl, out, err, both);
}
// console.group test
unitTest(function consoleGroup() {
    mockConsole(function(console1, out) {
        console1.group("1");
        console1.log("2");
        console1.group("3");
        console1.log("4");
        console1.groupEnd();
        console1.groupEnd();
        console1.log("5");
        console1.log("6");
        assertEquals(out.toString(), "1\n    2\n    3\n        4\n5\n6\n");
    });
});
// console.group with console.warn test
unitTest(function consoleGroupWarn() {
    mockConsole(function(console1, _out, _err, both) {
        assert(both);
        console1.warn("1");
        console1.group();
        console1.warn("2");
        console1.group();
        console1.warn("3");
        console1.groupEnd();
        console1.warn("4");
        console1.groupEnd();
        console1.warn("5");
        console1.warn("6");
        console1.warn("7");
        assertEquals(both.toString(), "1\n    2\n        3\n    4\n5\n6\n7\n");
    });
});
// console.table test
unitTest(function consoleTable() {
    mockConsole(function(console1, out) {
        console1.table({
            a: "test",
            b: 1
        });
        assertEquals(stripColor(out.toString()), '┌───────┬────────┐\n│ (idx) │ Values │\n├───────┼────────┤\n│   a   │ "test" │\n│   b   │   1    │\n└───────┴────────┘\n');
    });
    mockConsole(function(console1, out) {
        console1.table({
            a: {
                b: 10
            },
            b: {
                b: 20,
                c: 30
            }
        }, [
            "c"
        ]);
        assertEquals(stripColor(out.toString()), "┌───────┬────┐\n│ (idx) │ c  │\n├───────┼────┤\n│   a   │    │\n│   b   │ 30 │\n└───────┴────┘\n");
    });
    mockConsole(function(console1, out) {
        console1.table([
            1,
            2,
            [
                3,
                [
                    4
                ]
            ],
            [
                5,
                6
            ],
            [
                [
                    7
                ],
                [
                    8
                ]
            ]
        ]);
        assertEquals(stripColor(out.toString()), "┌───────┬───────┬───────┬────────┐\n│ (idx) │   0   │   1   │ Values │\n├───────┼───────┼───────┼────────┤\n│   0   │       │       │   1    │\n│   1   │       │       │   2    │\n│   2   │   3   │ [ 4 ] │        │\n│   3   │   5   │   6   │        │\n│   4   │ [ 7 ] │ [ 8 ] │        │\n└───────┴───────┴───────┴────────┘\n");
    });
    mockConsole(function(console1, out) {
        console1.table(new Set([
            1,
            2,
            3,
            "test"
        ]));
        assertEquals(stripColor(out.toString()), '┌────────────┬────────┐\n│ (iter idx) │ Values │\n├────────────┼────────┤\n│     0      │   1    │\n│     1      │   2    │\n│     2      │   3    │\n│     3      │ "test" │\n└────────────┴────────┘\n');
    });
    mockConsole(function(console1, out) {
        console1.table(new Map([
            [
                1,
                "one"
            ],
            [
                2,
                "two"
            ]
        ]));
        assertEquals(stripColor(out.toString()), '┌────────────┬─────┬────────┐\n│ (iter idx) │ Key │ Values │\n├────────────┼─────┼────────┤\n│     0      │  1  │ "one"  │\n│     1      │  2  │ "two"  │\n└────────────┴─────┴────────┘\n');
    });
    mockConsole(function(console1, out) {
        console1.table({
            a: true,
            b: {
                c: {
                    d: 10
                },
                e: [
                    1,
                    2,
                    [
                        5,
                        6
                    ]
                ]
            },
            f: "test",
            g: new Set([
                1,
                2,
                3,
                "test"
            ]),
            h: new Map([
                [
                    1,
                    "one"
                ]
            ])
        });
        assertEquals(stripColor(out.toString()), '┌───────┬───────────┬───────────────────┬────────┐\n│ (idx) │     c     │         e         │ Values │\n├───────┼───────────┼───────────────────┼────────┤\n│   a   │           │                   │  true  │\n│   b   │ { d: 10 } │ [ 1, 2, [Array] ] │        │\n│   f   │           │                   │ "test" │\n│   g   │           │                   │        │\n│   h   │           │                   │        │\n└───────┴───────────┴───────────────────┴────────┘\n');
    });
    mockConsole(function(console1, out) {
        console1.table([
            1,
            "test",
            false,
            {
                a: 10
            },
            [
                "test",
                {
                    b: 20,
                    c: "test"
                }
            ]
        ]);
        assertEquals(stripColor(out.toString()), '┌───────┬────────┬──────────────────────┬────┬────────┐\n│ (idx) │   0    │          1           │ a  │ Values │\n├───────┼────────┼──────────────────────┼────┼────────┤\n│   0   │        │                      │    │   1    │\n│   1   │        │                      │    │ "test" │\n│   2   │        │                      │    │ false  │\n│   3   │        │                      │ 10 │        │\n│   4   │ "test" │ { b: 20, c: "test" } │    │        │\n└───────┴────────┴──────────────────────┴────┴────────┘\n');
    });
    mockConsole(function(console1, out) {
        console1.table([]);
        assertEquals(stripColor(out.toString()), "┌───────┐\n│ (idx) │\n├───────┤\n└───────┘\n");
    });
    mockConsole(function(console1, out) {
        console1.table({});
        assertEquals(stripColor(out.toString()), "┌───────┐\n│ (idx) │\n├───────┤\n└───────┘\n");
    });
    mockConsole(function(console1, out) {
        console1.table(new Set());
        assertEquals(stripColor(out.toString()), "┌────────────┐\n│ (iter idx) │\n├────────────┤\n└────────────┘\n");
    });
    mockConsole(function(console1, out) {
        console1.table(new Map());
        assertEquals(stripColor(out.toString()), "┌────────────┐\n│ (iter idx) │\n├────────────┤\n└────────────┘\n");
    });
    mockConsole(function(console1, out) {
        console1.table("test");
        assertEquals(out.toString(), "test\n");
    });
    mockConsole(function(console1, out) {
        console1.table([
            "Hello",
            "你好",
            "Amapá"
        ]);
        assertEquals(stripColor(out.toString()), '┌───────┬─────────┐\n│ (idx) │ Values  │\n├───────┼─────────┤\n│   0   │ "Hello" │\n│   1   │ "你好"  │\n│   2   │ "Amap\xe1" │\n└───────┴─────────┘\n');
    });
    mockConsole(function(console1, out) {
        console1.table([
            [
                1,
                2
            ],
            [
                3,
                4
            ]
        ]);
        assertEquals(stripColor(out.toString()), "┌───────┬───┬───┐\n│ (idx) │ 0 │ 1 │\n├───────┼───┼───┤\n│   0   │ 1 │ 2 │\n│   1   │ 3 │ 4 │\n└───────┴───┴───┘\n");
    });
    mockConsole(function(console1, out) {
        console1.table({
            1: {
                a: 4,
                b: 5
            },
            2: null,
            3: {
                b: 6,
                c: 7
            }
        }, [
            "b"
        ]);
        assertEquals(stripColor(out.toString()), "┌───────┬───┐\n│ (idx) │ b │\n├───────┼───┤\n│   1   │ 5 │\n│   2   │   │\n│   3   │ 6 │\n└───────┴───┘\n");
    });
});
// console.log(Error) test
unitTest(function consoleLogShouldNotThrowError() {
    mockConsole(function(console1) {
        var result = 0;
        try {
            console1.log(new Error("foo"));
            result = 1;
        } catch (e) {
            result = 2;
        }
        assertEquals(result, 1);
    });
    // output errors to the console should not include "Uncaught"
    mockConsole(function(console1, out) {
        console1.log(new Error("foo"));
        assertEquals(out.toString().includes("Uncaught"), false);
    });
});
// console.log(Invalid Date) test
unitTest(function consoleLogShoultNotThrowErrorWhenInvalidDateIsPassed() {
    mockConsole(function(console1, out) {
        var invalidDate = new Date("test");
        console1.log(invalidDate);
        assertEquals(stripColor(out.toString()), "Invalid Date\n");
    });
});
// console.dir test
unitTest(function consoleDir() {
    mockConsole(function(console1, out) {
        console1.dir("DIR");
        assertEquals(out.toString(), "DIR\n");
    });
    mockConsole(function(console1, out) {
        console1.dir("DIR", {
            indentLevel: 2
        });
        assertEquals(out.toString(), "    DIR\n");
    });
});
// console.dir test
unitTest(function consoleDirXml() {
    mockConsole(function(console1, out) {
        console1.dirxml("DIRXML");
        assertEquals(out.toString(), "DIRXML\n");
    });
    mockConsole(function(console1, out) {
        console1.dirxml("DIRXML", {
            indentLevel: 2
        });
        assertEquals(out.toString(), "    DIRXML\n");
    });
});
// console.trace test
unitTest(function consoleTrace() {
    mockConsole(function(console1, _out, err) {
        console1.trace("%s", "custom message");
        assert(err);
        assert(err.toString().includes("Trace: custom message"));
    });
});
