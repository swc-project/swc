//// [keyofAndIndexedAccessErrors.ts]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
var Shape = function Shape() {
    "use strict";
    _class_call_check(this, Shape);
};
function getProperty(obj, key) {
    return obj[key];
}
function setProperty(obj, key, value) {
    obj[key] = value;
}
function f10(shape) {
    var x1 = getProperty(shape, "name");
    var x2 = getProperty(shape, "size"); // Error
    var x3 = getProperty(shape, cond ? "name" : "size"); // Error
    setProperty(shape, "name", "rectangle");
    setProperty(shape, "size", 10); // Error
    setProperty(shape, cond ? "name" : "size", 10); // Error
}
function f20(x, y, k1, k2, k3, k4) {
    x[k1];
    x[k2];
    x[k3]; // Error
    x[k4]; // Error
    y[k1];
    y[k2];
    y[k3];
    y[k4];
    k1 = k2;
    k1 = k3; // Error
    k1 = k4; // Error
    k2 = k1;
    k2 = k3; // Error
    k2 = k4; // Error
    k3 = k1;
    k3 = k2;
    k3 = k4;
    k4 = k1;
    k4 = k2;
    k4 = k3;
}
// Repro from #17166
function f3(t, k, tk, u, j, uk, tj, uj) {
    for(var key in t){
        key = k // ok, K ==> keyof T
        ;
        k = key // error, keyof T =/=> K
        ;
        t[key] = tk; // ok, T[K] ==> T[keyof T]
        tk = t[key]; // error, T[keyof T] =/=> T[K]
    }
    tk = uk;
    uk = tk; // error
    tj = uj;
    uj = tj; // error
    tk = tj;
    tj = tk; // error
    tk = uj;
    uj = tk; // error
}
// The constraint of 'keyof T' is 'keyof T'
function f4(k) {
    k = 42; // error
    k = "hello"; // error
}
var a1 = 'a'; // Error
var b1 = 'b';
function test1(t, k) {
    t[k] = 42; // Error
    t[k] = "hello"; // Error
    t[k] = [
        10,
        20
    ]; // Error
}
// Repro from #28839
function f30() {
    var x = "hello";
}
function f31() {
    var x = "hello";
}
// Repro from #51069
var Test = /*#__PURE__*/ function() {
    "use strict";
    function Test(t) {
        _class_call_check(this, Test);
        this.testy = t;
    }
    var _proto = Test.prototype;
    _proto.t = function t(key) {
        this.testy[key] += 1; // Error
        return this.testy[key];
    };
    return Test;
}();
