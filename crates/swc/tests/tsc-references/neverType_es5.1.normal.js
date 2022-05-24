import _class_call_check from "@swc/helpers/lib/_class_call_check.js";
// @strictNullChecks: true
// @declaration: true
function error(message) {
    throw new Error(message);
}
function errorVoid(message) {
    throw new Error(message);
}
function fail() {
    return error("Something failed");
}
function failOrThrow(shouldFail) {
    if (shouldFail) {
        return fail();
    }
    throw new Error();
}
function infiniteLoop1() {
    while(true){}
}
function infiniteLoop2() {
    while(true){}
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
    return direction === "up" ? 1 : direction === "down" ? -1 : error("Should never get here");
}
function check(x) {
    return x || error("Undefined value");
}
var C = /*#__PURE__*/ function() {
    "use strict";
    function C() {
        _class_call_check(this, C);
    }
    var _proto = C.prototype;
    _proto.void1 = function void1() {
        throw new Error();
    };
    _proto.void2 = function void2() {
        while(true){}
    };
    _proto.never1 = function never1() {
        throw new Error();
    };
    _proto.never2 = function never2() {
        while(true){}
    };
    return C;
}();
function f1(x) {
    if (typeof x === "boolean") {
        x; // never
    }
}
function f2(x) {
    while(true){
        if (typeof x === "boolean") {
            return x; // never
        }
    }
}
function test(cb) {
    var s = cb();
    return s;
}
var errorCallback = function() {
    return error("Error callback");
};
test(function() {
    return "hello";
});
test(function() {
    return fail();
});
test(function() {
    throw new Error();
});
test(errorCallback);
