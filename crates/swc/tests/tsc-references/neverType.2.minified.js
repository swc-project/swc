//// [neverType.ts]
import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
function error(message) {
    throw Error(message);
}
function errorVoid(message) {
    throw Error(message);
}
function fail() {
    return error("Something failed");
}
function failOrThrow(shouldFail) {
    if (shouldFail) return fail();
    throw Error();
}
function infiniteLoop1() {
    for(;;);
}
function infiniteLoop2() {
    for(;;);
}
function move1(direction) {
    switch(direction){
        case "up":
            return 1;
        case "down":
            return -1;
    }
    return error("Should never get here");
}
function move2(direction) {
    return "up" === direction ? 1 : "down" === direction ? -1 : error("Should never get here");
}
function check(x) {
    return x || error("Undefined value");
}
var C = function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    return _proto.void1 = function() {
        throw Error();
    }, _proto.void2 = function() {
        for(;;);
    }, _proto.never1 = function() {
        throw Error();
    }, _proto.never2 = function() {
        for(;;);
    }, C;
}();
function f1(x) {}
function f2(x) {
    for(;;)if ("boolean" == typeof x) return x;
}
function test(cb) {
    return cb();
}
var errorCallback = function() {
    return error("Error callback");
};
test(function() {
    return "hello";
}), test(function() {
    return fail();
}), test(function() {
    throw Error();
}), test(errorCallback);
