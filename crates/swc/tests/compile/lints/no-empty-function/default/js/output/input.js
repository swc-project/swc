var _async_to_generator = require("@swc/helpers/_/_async_to_generator");
var _class_call_check = require("@swc/helpers/_/_class_call_check");
var _create_class = require("@swc/helpers/_/_create_class");
var _define_enumerable_properties = require("@swc/helpers/_/_define_enumerable_properties");
var _define_property = require("@swc/helpers/_/_define_property");
var _ts_generator = require("@swc/helpers/_/_ts_generator");
function foo1() {}
var foo2 = function foo2() {};
var foo3 = function foo3() {
    bar();
};
function foo4() {
    return _ts_generator._(this, function(_state) {
        return [
            2
        ];
    });
}
var foo5 = function foo5() {
    return _ts_generator._(this, function(_state) {
        return [
            2
        ];
    });
};
var foo6 = function foo6() {};
function foo7() {
    return _async_to_generator._(function() {
        return _ts_generator._(this, function(_state) {
            return [
                2
            ];
        });
    })();
}
var A = /*#__PURE__*/ function() {
    "use strict";
    function A() {
        _class_call_check._(this, A);
    }
    _create_class._(A, [
        {
            key: "foo",
            get: function get() {},
            set: function set(value) {}
        }
    ], [
        {
            key: "foo",
            get: function get() {},
            set: function set(value) {}
        }
    ]);
    return A;
}();
var _obj, _mutatorMap = {};
var obj = (_obj = {
    foo: function foo() {}
}, _define_property._(_obj, "foo", function foo() {
    return _ts_generator._(this, function(_state) {
        return [
            2
        ];
    });
}), _define_property._(_obj, "foo", function foo() {}), _define_property._(_obj, "foo", function foo() {
    return _ts_generator._(this, function(_state) {
        return [
            2
        ];
    });
}), _mutatorMap["foo"] = _mutatorMap["foo"] || {}, _mutatorMap["foo"].get = function() {}, _mutatorMap["foo"] = _mutatorMap["foo"] || {}, _mutatorMap["foo"].set = function(value) {}, _define_enumerable_properties._(_obj, _mutatorMap), _obj);
function foo_with_comment() {
// comment
}
(function() {
/* comment */ });
