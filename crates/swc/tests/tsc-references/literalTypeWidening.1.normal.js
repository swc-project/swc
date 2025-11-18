//// [literalTypeWidening.ts]
// Widening vs. non-widening literal types
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
function f1() {
    var c1 = "hello"; // Widening type "hello"
    var v1 = c1; // Type string
    var c2 = c1; // Widening type "hello"
    var v2 = c2; // Type string
    var c3 = "hello"; // Type "hello"
    var v3 = c3; // Type "hello"
    var c4 = c1; // Type "hello"
    var v4 = c4; // Type "hello"
}
function f2(cond) {
    var c1 = cond ? "foo" : "bar"; // widening "foo" | widening "bar"
    var c2 = c1; // "foo" | "bar"
    var c3 = cond ? c1 : c2; // "foo" | "bar"
    var c4 = cond ? c3 : "baz"; // "foo" | "bar" | widening "baz"
    var c5 = c4; // "foo" | "bar" | "baz"
    var v1 = c1; // string
    var v2 = c2; // "foo" | "bar"
    var v3 = c3; // "foo" | "bar"
    var v4 = c4; // string
    var v5 = c5; // "foo" | "bar" | "baz"
}
function f3() {
    var c1 = 123; // Widening type 123
    var v1 = c1; // Type number
    var c2 = c1; // Widening type 123
    var v2 = c2; // Type number
    var c3 = 123; // Type 123
    var v3 = c3; // Type 123
    var c4 = c1; // Type 123
    var v4 = c4; // Type 123
}
function f4(cond) {
    var c1 = cond ? 123 : 456; // widening 123 | widening 456
    var c2 = c1; // 123 | 456
    var c3 = cond ? c1 : c2; // 123 | 456
    var c4 = cond ? c3 : 789; // 123 | 456 | widening 789
    var c5 = c4; // 123 | 456 | 789
    var v1 = c1; // number
    var v2 = c2; // 123 | 456
    var v3 = c3; // 123 | 456
    var v4 = c4; // number
    var v5 = c5; // 123 | 456 | 789
}
function f5() {
    var c1 = "foo";
    var v1 = c1;
    var c2 = "foo";
    var v2 = c2;
    var c3 = "foo";
    var v3 = c3;
    var c4 = "foo";
    var v4 = c4;
}
function f6(cond) {
    var x1 = widening('a');
    var x2 = widening(10);
    var x3 = widening(cond ? 'a' : 10);
    var y1 = nonWidening('a');
    var y2 = nonWidening(10);
    var y3 = nonWidening(cond ? 'a' : 10);
}
var FAILURE = "FAILURE";
function doWork() {
    return FAILURE;
}
function isSuccess(result) {
    return !isFailure(result);
}
function isFailure(result) {
    return result === FAILURE;
}
function increment(x) {
    return x + 1;
}
var result = doWork();
if (isSuccess(result)) {
    increment(result);
}
function onMouseOver() {
    return "onmouseover";
}
var x = onMouseOver();
// Repro from #23649
export function Set() {
    for(var _len = arguments.length, _$keys = new Array(_len), _key = 0; _key < _len; _key++){
        _$keys[_key] = arguments[_key];
    }
    var result = {};
    _$keys.forEach(function(key) {
        return result[key] = true;
    });
    return result;
}
export function keys(obj) {
    return Object.keys(obj);
}
var langCodeSet = Set('fr', 'en', 'es', 'it', 'nl');
export var langCodes = keys(langCodeSet);
var arr = langCodes.map(function(code) {
    return {
        code: code
    };
});
// Repro from #29081
function test(obj) {
    var a = obj.a, rest = _object_without_properties(obj, [
        "a"
    ]);
    return _object_spread({
        a: 'hello'
    }, rest);
}
var E = /*#__PURE__*/ function(E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
    return E;
}(E || {});
var a = f(0);
var b = a;
