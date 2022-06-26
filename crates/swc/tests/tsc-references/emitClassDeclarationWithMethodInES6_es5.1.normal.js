import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
// @target:es6
var D = /*#__PURE__*/ function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
    }
    var _proto = D.prototype;
    _proto.foo = function foo() {};
    _proto["computedName1"] = function() {};
    _proto["computedName2"] = function(a) {};
    _proto["computedName3"] = function(a) {
        return 1;
    };
    _proto.bar = function bar() {
        return this._bar;
    };
    _proto.baz = function baz(a, x) {
        return "HELLO";
    };
    D["computedname4"] = function() {};
    D["computedname5"] = function(a) {};
    D["computedname6"] = function(a) {
        return true;
    };
    D.staticMethod = function staticMethod() {
        var x = 1 + 2;
        return x;
    };
    D.foo = function foo(a) {};
    D.bar = function bar(a) {
        return 1;
    };
    return D;
}();
