//// [keyofAndIndexedAccessErrors.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
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
    getProperty(shape, "name"), getProperty(shape, "size"), getProperty(shape, cond ? "name" : "size"), setProperty(shape, "name", "rectangle"), setProperty(shape, "size", 10), setProperty(shape, cond ? "name" : "size", 10);
}
function f20(x, y, k1, k2, k3, k4) {
    x[k1], x[k2], x[k3], x[k4], y[k1], y[k2], y[k3], y[k4], k1 = k2, k1 = k3, k2 = k1 = k4, k2 = k3, k2 = k4, k3 = k1, k3 = k2, k3 = k4, k4 = k1, k4 = k2, k4 = k3;
}
function f3(t, k, tk, u, j, uk, tj, uj) {
    for(var key in t)k = key = k, t[key] = tk, tk = t[key];
    uk = tk = uk, uj = tj = uj, tj = tk = tj, uj = tk = uj;
}
function f4(k) {}
var a1 = "a", b1 = "b";
function test1(t, k) {
    t[k] = 42, t[k] = "hello", t[k] = [
        10,
        20
    ];
}
function f30() {}
function f31() {}
