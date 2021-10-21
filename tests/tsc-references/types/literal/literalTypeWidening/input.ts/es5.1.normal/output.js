function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {
        };
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {
    };
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {
    };
    var target = {
    };
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
// Widening vs. non-widening literal types
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
var result1 = doWork();
if (isSuccess(result1)) {
    increment(result1);
}
function onMouseOver() {
    return "onmouseover";
}
var x1 = onMouseOver();
// Repro from #23649
export function Set() {
    for(var _len = arguments.length, keys = new Array(_len), _key = 0; _key < _len; _key++){
        keys[_key] = arguments[_key];
    }
    var result = {
    };
    keys.forEach(function(key) {
        return result[key] = true;
    });
    return result;
}
function keys1(obj) {
    return Object.keys(obj);
}
export { keys1 as keys };
var langCodeSet = Set('fr', 'en', 'es', 'it', 'nl');
export var langCodes = keys1(langCodeSet);
var arr = langCodes.map(function(code) {
    return {
        code: code
    };
});
// Repro from #29081
function test(obj) {
    var a = obj.a, rest = _objectWithoutProperties(obj, [
        "a"
    ]);
    return _objectSpread({
        a: 'hello'
    }, rest);
}
var E1;
(function(E) {
    E[E["A"] = 0] = "A";
    E[E["B"] = 1] = "B";
})(E1 || (E1 = {
}));
var a = f(E1.A);
var b = a;
