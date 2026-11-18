function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
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
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assert, assertEquals } from "./test_util.ts";
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function setup() {
    var dataSymbol = Symbol("data symbol");
    var _dataSymbol = dataSymbol;
    var Base = function Base(data) {
        "use strict";
        _class_call_check(this, Base);
        _define_property(this, _dataSymbol, new Map());
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var _step_value = _sliced_to_array(_step.value, 2), key = _step_value[0], value = _step_value[1];
                this[dataSymbol].set(key, value);
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
    };
    return {
        Base: Base,
        // This is using an internal API we don't want published as types, so having
        // to cast to any to "trick" TypeScript
        // @ts-expect-error TypeScript (as of 3.7) does not support indexing namespaces by symbol
        DomIterable: Deno[Deno.internal].DomIterableMixin(Base, dataSymbol)
    };
}
unitTest(function testDomIterable() {
    var _setup = setup(), DomIterable = _setup.DomIterable, Base = _setup.Base;
    var fixture = [
        [
            "foo",
            1
        ],
        [
            "bar",
            2
        ]
    ];
    var domIterable = new DomIterable(fixture);
    assertEquals(Array.from(domIterable.entries()), fixture);
    assertEquals(Array.from(domIterable.values()), [
        1,
        2
    ]);
    assertEquals(Array.from(domIterable.keys()), [
        "foo",
        "bar"
    ]);
    var result = [];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = domIterable[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var _step_value = _sliced_to_array(_step.value, 2), key = _step_value[0], value = _step_value[1];
            assert(key != null);
            assert(value != null);
            result.push([
                key,
                value
            ]);
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
    assertEquals(fixture, result);
    result = [];
    var scope = {};
    function callback(value, key, parent) {
        assertEquals(parent, domIterable);
        assert(key != null);
        assert(value != null);
        assert(this === scope);
        result.push([
            key,
            value
        ]);
    }
    domIterable.forEach(callback, scope);
    assertEquals(fixture, result);
    assertEquals(DomIterable.name, Base.name);
});
unitTest(function testDomIterableScope() {
    var DomIterable = setup().DomIterable;
    var domIterable = new DomIterable([
        [
            "foo",
            1
        ]
    ]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function checkScope(thisArg, expected) {
        function callback() {
            assertEquals(this, expected);
        }
        domIterable.forEach(callback, thisArg);
    }
    checkScope(0, Object(0));
    checkScope("", Object(""));
    checkScope(null, window);
    checkScope(undefined, window);
});
