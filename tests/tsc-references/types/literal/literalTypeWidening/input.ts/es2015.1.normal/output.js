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
    const c1 = "hello"; // Widening type "hello"
    let v1 = c1; // Type string
    const c2 = c1; // Widening type "hello"
    let v2 = c2; // Type string
    const c3 = "hello"; // Type "hello"
    let v3 = c3; // Type "hello"
    const c4 = c1; // Type "hello"
    let v4 = c4; // Type "hello"
}
function f2(cond) {
    const c1 = cond ? "foo" : "bar"; // widening "foo" | widening "bar"
    const c2 = c1; // "foo" | "bar"
    const c3 = cond ? c1 : c2; // "foo" | "bar"
    const c4 = cond ? c3 : "baz"; // "foo" | "bar" | widening "baz"
    const c5 = c4; // "foo" | "bar" | "baz"
    let v1 = c1; // string
    let v2 = c2; // "foo" | "bar"
    let v3 = c3; // "foo" | "bar"
    let v4 = c4; // string
    let v5 = c5; // "foo" | "bar" | "baz"
}
function f3() {
    const c1 = 123; // Widening type 123
    let v1 = c1; // Type number
    const c2 = c1; // Widening type 123
    let v2 = c2; // Type number
    const c3 = 123; // Type 123
    let v3 = c3; // Type 123
    const c4 = c1; // Type 123
    let v4 = c4; // Type 123
}
function f4(cond) {
    const c1 = cond ? 123 : 456; // widening 123 | widening 456
    const c2 = c1; // 123 | 456
    const c3 = cond ? c1 : c2; // 123 | 456
    const c4 = cond ? c3 : 789; // 123 | 456 | widening 789
    const c5 = c4; // 123 | 456 | 789
    let v1 = c1; // number
    let v2 = c2; // 123 | 456
    let v3 = c3; // 123 | 456
    let v4 = c4; // number
    let v5 = c5; // 123 | 456 | 789
}
function f5() {
    const c1 = "foo";
    let v1 = c1;
    const c2 = "foo";
    let v2 = c2;
    const c3 = "foo";
    let v3 = c3;
    const c4 = "foo";
    let v4 = c4;
}
function f6(cond) {
    let x1 = widening('a');
    let x2 = widening(10);
    let x3 = widening(cond ? 'a' : 10);
    let y1 = nonWidening('a');
    let y2 = nonWidening(10);
    let y3 = nonWidening(cond ? 'a' : 10);
}
const FAILURE = "FAILURE";
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
let result1 = doWork();
if (isSuccess(result1)) {
    increment(result1);
}
function onMouseOver() {
    return "onmouseover";
}
let x1 = onMouseOver();
// Repro from #23649
export function Set(...keys) {
    const result = {
    };
    keys.forEach((key)=>result[key] = true
    );
    return result;
}
function keys1(obj) {
    return Object.keys(obj);
}
export { keys1 as keys };
const langCodeSet = Set('fr', 'en', 'es', 'it', 'nl');
export const langCodes = keys1(langCodeSet);
const arr = langCodes.map((code)=>({
        code
    })
);
// Repro from #29081
function test(obj) {
    let { a  } = obj, rest = _objectWithoutProperties(obj, [
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
const a = f(E1.A);
const b = a;
