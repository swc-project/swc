//// [unionTypeFromArrayLiteral.ts]
// The resulting type an array literal expression is determined as follows:
// If the array literal is empty, the resulting type is an array type with the element type Undefined.
// Otherwise, if the array literal is contextually typed by a type that has a property with the numeric name ‘0’, the resulting type is a tuple type constructed from the types of the element expressions.
// Otherwise, the resulting type is an array type with an element type that is the union of the types of the element expressions.
import { _ as _call_super } from "@swc/helpers/_/_call_super";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
var arr1 = [
    1,
    2
]; // number[]
var arr2 = [
    "hello",
    true
]; // (string | number)[]
var arr3Tuple = [
    3,
    "three"
]; // [number, string]
var arr4Tuple = [
    3,
    "three",
    "hello"
]; // [number, string, string]
var arrEmpty = [];
var arr5Tuple = [
    "hello",
    true,
    false,
    " hello",
    true,
    10,
    "any"
]; // Tuple
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.foo = function foo() {};
    return C;
}();
var D = /*#__PURE__*/ function() {
    "use strict";
    function D() {
        _class_call_check(this, D);
    }
    var _proto = D.prototype;
    _proto.foo2 = function foo2() {};
    return D;
}();
var E = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(E, C);
    function E() {
        _class_call_check(this, E);
        return _call_super(this, E, arguments);
    }
    var _proto = E.prototype;
    _proto.foo3 = function foo3() {};
    return E;
}(C);
var F = /*#__PURE__*/ function(C) {
    "use strict";
    _inherits(F, C);
    function F() {
        _class_call_check(this, F);
        return _call_super(this, F, arguments);
    }
    var _proto = F.prototype;
    _proto.foo4 = function foo4() {};
    return F;
}(C);
var c, d, e, f;
var arr6 = [
    c,
    d
]; // (C | D)[]
var arr7 = [
    c,
    d,
    e
]; // (C | D)[]
var arr8 = [
    c,
    e
]; // C[]
var arr9 = [
    e,
    f
]; // (E|F)[]
