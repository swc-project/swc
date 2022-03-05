import * as swcHelpers from "@swc/helpers";
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
        swcHelpers.classCallCheck(this, C);
    }
    swcHelpers.createClass(C, [
        {
            key: "void1",
            value: function void1() {
                throw new Error();
            }
        },
        {
            key: "void2",
            value: function void2() {
                while(true){}
            }
        },
        {
            key: "never1",
            value: function never1() {
                throw new Error();
            }
        },
        {
            key: "never2",
            value: function never2() {
                while(true){}
            }
        }
    ]);
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
