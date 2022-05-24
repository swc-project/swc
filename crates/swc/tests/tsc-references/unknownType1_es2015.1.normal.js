import _extends from "@swc/helpers/lib/_extends.js";
import _object_spread from "@swc/helpers/lib/_object_spread.js";
// Only equality operators are allowed with unknown
function f10(x) {
    x == 5;
    x !== 10;
    x >= 0; // Error
    x.foo; // Error
    x[10]; // Error
    x(); // Error
    x + 1; // Error
    x * 2; // Error
    -x; // Error
    +x; // Error
}
// No property accesses, element accesses, or function calls
function f11(x) {
    x.foo; // Error
    x[5]; // Error
    x(); // Error
    new x(); // Error
}
function f20(x) {
    if (typeof x === "string" || typeof x === "number") {
        x; // string | number
    }
    if (x instanceof Error) {
        x; // Error
    }
    if (isFunction(x)) {
        x; // Function
    }
}
// Anything is assignable to unknown
function f21(pAny, pNever, pT) {
    let x;
    x = 123;
    x = "hello";
    x = [
        1,
        2,
        3
    ];
    x = new Error();
    x = x;
    x = pAny;
    x = pNever;
    x = pT;
}
// unknown assignable only to itself and any
function f22(x) {
    let v1 = x;
    let v2 = x;
    let v3 = x; // Error
    let v4 = x; // Error
    let v5 = x; // Error
    let v6 = x; // Error
    let v7 = x; // Error
}
// Type parameter 'T extends unknown' not related to object
function f23(x) {
    let y = x; // Error
}
// Anything fresh but primitive assignable to { [x: string]: unknown }
function f24(x) {
    x = {};
    x = {
        a: 5
    };
    x = [
        1,
        2,
        3
    ]; // Error
    x = 123; // Error
}
// Locals of type unknown always considered initialized
function f25() {
    let x;
    let y = x;
}
// Spread of unknown causes result to be unknown
function f26(x, y, z) {
    let o1 = _object_spread({
        a: 42
    }, x); // { a: number }
    let o2 = _object_spread({
        a: 42
    }, x, y); // unknown
    let o3 = _object_spread({
        a: 42
    }, x, y, z); // any
    let o4 = _object_spread({
        a: 42
    }, z); // any
}
// Functions with unknown return type don't need return expressions
function f27() {}
// Rest type cannot be created from unknown
function f28(x) {
    let a = _extends({}, x); // Error
}
// Class properties of type unknown don't need definite assignment
class C1 {
}
// Type parameter with explicit 'unknown' constraint not assignable to '{}'
function f30(t, u) {
    let x = t;
    let y = u;
}
function oops(arg) {
    return arg; // Error
}
