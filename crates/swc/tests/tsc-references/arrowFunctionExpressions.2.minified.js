//// [arrowFunctionExpressions.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_array from "@swc/helpers/src/_to_array.mjs";
var c, d, e, g, a = function(p) {
    return p.length;
}, a = function(p) {
    return p.length;
}, b = function(j) {
    return 0;
}, b = function(j) {
    return 0;
}, d = function(n) {
    return n;
}, d = function(n) {
    return n;
}, p1 = function(param) {
    _sliced_to_array(param, 1)[0];
}, p2 = function(param) {
    _to_array(param).slice(0);
}, p3 = function(param) {
    _sliced_to_array(param, 2)[1];
}, p4 = function(param) {
    _to_array(param).slice(1);
}, p5 = function(param) {
    _sliced_to_array(param, 1)[0];
}, p6 = function(param) {
    param.a;
}, p7 = function(param) {
    param.a.b;
}, p8 = function(param) {
    param.a;
}, p9 = function(param) {
    var tmp = param.a;
    (void 0 === tmp ? {
        b: 1
    } : tmp).b;
}, p10 = function(param) {
    var ref = _sliced_to_array(param, 1)[0];
    ref.value, ref.done;
}, MyClass = function() {
    "use strict";
    function MyClass() {
        var _this = this;
        _class_call_check(this, MyClass), this.m = function(n) {
            return n + 1;
        }, this.p = function(n) {
            return n && _this;
        };
    }
    return MyClass.prototype.fn = function() {}, MyClass;
}(), arrrr = function() {
    return function(m) {
        return function() {
            return function(n) {
                return m + n;
            };
        };
    };
}, e = arrrr()(3)()(4);
function someFn() {
    12..toExponential();
}
function someOtherFn() {
    "4".charAt(0);
}
function outerFn() {}
var f = function(n) {
    return function() {
        return n + 4;
    };
}, g = f("")();
function someOuterFn() {
    return function(n) {
        return function() {
            return function() {
                return n.length;
            };
        };
    };
}
var h = someOuterFn()("")()();
function tryCatchFn() {}
h.toExponential();
