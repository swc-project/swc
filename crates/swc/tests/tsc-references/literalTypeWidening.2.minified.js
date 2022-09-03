//// [literalTypeWidening.ts]
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_without_properties from "@swc/helpers/src/_object_without_properties.mjs";
function f1() {}
function f2(cond) {}
function f3() {}
function f4(cond) {}
function f5() {}
function f6(cond) {
    widening("a"), widening(10), widening(cond ? "a" : 10), nonWidening("a"), nonWidening(10), nonWidening(cond ? "a" : 10);
}
var E, FAILURE = "FAILURE";
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
function onMouseOver() {
    return "onmouseover";
}
isSuccess(result) && increment(result);
var x = onMouseOver();
export function Set() {
    for(var _len = arguments.length, _$keys = Array(_len), _key = 0; _key < _len; _key++)_$keys[_key] = arguments[_key];
    var result = {};
    return _$keys.forEach(function(key) {
        return result[key] = !0;
    }), result;
}
export function keys(obj) {
    return Object.keys(obj);
}
var langCodeSet = Set("fr", "en", "es", "it", "nl");
export var langCodes = keys(langCodeSet);
var arr = langCodes.map(function(code) {
    return {
        code: code
    };
});
function test(obj) {
    return obj.a, _object_spread({
        a: "hello"
    }, _object_without_properties(obj, [
        "a"
    ]));
}
!function(E) {
    E[E.A = 0] = "A", E[E.B = 1] = "B";
}(E || (E = {}));
var a = f(E.A), b = a;
